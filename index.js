//var http = require("http");
require("dotenv").config();
var express = require("express");
const bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var app = express();
var PORT = 8080;
var ACCESS_TOKEN_SECRET = "1234567890";
var REFRESH_TOKEN_SECRET = "0987654321";
const cors = require("cors");
//app.use(express.json);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://4l9l3x.csb.app",
  })
);
//create a server object:
// http
//   .createServer(function (req, res) {
//     res.write("Hello from suraj!"); //write a response to the client
//     res.end(); //end the response
//   })
//   .listen(8080); //the server object listens on port 8080
const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
};
var UserData = require("./UserData");
//----------------------------------------------------
app.get("/", (req, res) => {
  console.log("hello from Suraj:");
  res.json({ data: "hello from Suraj" + JSON.stringify(UserData) });
});
//----------------------------------------------------
app.get("/post", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
  res.json("hello from post");
});
//----------------------------------------------------
app.post("/login", (req, res) => {
  let jwt_token = null;
  //console.log("login:" + req.body.username);
  //res.json("hello from login:" + req.body.username);
  //const username = "suraj"; //res.body.username;
  let FoundUser = UserData.filter(
    (u) =>
      u.username === req.body?.username && u.password === req.body?.password
  );
  if (FoundUser?.length > 0) {
    const { username, password, role } = FoundUser[0];
    console.log(username, password);
    jwt_token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
    res.json({
      username: username,
      password: password,
      role: role,
      accessToken: jwt_token,
    });
  } else {
    res.sendStatus(403);
    //res.json(`${req.body.username} user not found`);
  }
});
//----------------------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}
app.listen(PORT);
