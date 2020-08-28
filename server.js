const express = require("express");
const app = express();
var bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");
const cors = require("cors");
const cont = require("./app/controllers/appController");
const authcont = require("./app/controllers/auth.controller");
// var orm = require('generic-orm-libarry');
// var user = orm("users").where({ email: 'test@test.com' });

const accessTokenSecret = "skylyn";

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Oh Hi There!");
});

app.post("/login", (req, res) => {
  var users = require('./users.json');
  // Read username and password from request body
  const {
    username,
    password
  } = req.body;

  var user;
  users.forEach(element => {
    if (element.username === username && element.password === password)
      user = true;
  });
  if (user) {
    // Generate an access token
    const accessToken = jwt.sign({
        username: users.username
      },
      accessTokenSecret
    );

    res.json({
      accessToken,
    });
  } else {
    res.send("Username or password incorrect");
  }

});

app.post("/signup", (req, res) => {
  const {
    username,
  } = req.body;

  var user = false;

  if (user) {
    
    return res.send("user already exist");
  } else {
    const accessToken = jwt.sign({
        username: username
      },
      accessTokenSecret
    );
    cont.addUser(req, res, accessToken);
  }
});

require("./app/routes/routes")(app, jwt, accessTokenSecret);

// curl http://localhost:8080/
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});