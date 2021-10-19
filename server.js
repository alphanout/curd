const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const cont = require("./app/controllers/appController");
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
  res.send("Oh Hello There!");
});

app.post("/login", (req, res) => {
  cont.login(req, res);
});

app.post("/signup", (req, res) => {
  cont.addUser(req, res);
});

require("./app/routes/routes")(app);

app.listen(port, () => {
  console.log(`Server is running on  the port ${port}.`);
});