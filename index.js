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
    origin: "https://gkd2h6.csb.app",
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
app.post("/login", (req, res) => {
  let jwt_token = null;
  let FoundUser = UserData.filter(
    (u) =>
      u.username === req.body?.username && u.password === req.body?.password
  );
  if (FoundUser?.length > 0) {
    const { username, password, role } = FoundUser[0];
    jwt_token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15s'});
    res.json({
      username: username,
      password: password,
      role: role,
      accessToken: jwt_token,
    });
  } else {
    res.sendStatus(403);
  }
});
//----------------------------------------------------
app.post("/verify", authenticateToken, (req, res) => {
  let user = UserData.filter((u) => u.username === req.username);
  //console.log(user);
  res.json(user);
  //res.json("hello from post");
});
//----------------------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    //console.log(`verify:${user}`);
    req.username = user;
    next();
  });
}
app.listen(PORT);
