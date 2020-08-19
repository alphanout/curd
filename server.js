const express = require("express");
const app = express();
var bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");
const cors = require("cors");

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

var router = express.Router();

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
  var users = require('./users.json');
  const fs = require('fs');
  const {
    username,
    password,
    email
  } = req.body;

  var user;
  users.forEach(element => {
    if (element.username === username)
      user = true;
  });
  if (user) {

    res.send("user already exist");
  } else {
    users[users.length] = {
      "username": username,
      "password": password,
      "email": email
    };
    fs.writeFile("./users.json", JSON.stringify(users), (err) => {
      if (err) throw err;
      console.log("Done writing");
    });
    res.sendStatus(200);
  }

});


require("./app/routes/routes")(app,jwt,accessTokenSecret);



// curl http://localhost:8080/
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

// const db = require("./app/models");
// db.sequelize.sync({
//   force: true
// }).then(() => {
//   console.log("Drop and re-sync db.");
// });