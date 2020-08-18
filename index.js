const express = require("express");
const app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get("/", function (req, res) {
  res.json({ message: "hooray! welcome to our api!" });
});

app.use("/api", router);

app.listen(port);
console.log("Working on port " + port);

app.get("/", (req, res) => {
  res.send("Oh Hi There!");
});

router
  .route("/courses")

  //curl http://localhost:8080/api/courses
  /*
  curl http://localhost:8080/api/courses/1
  curl --header "Content-Type: application/json" \--request POST \--data '{"Id” : “1234”,   "name": "maths",  "description": "This is mathematics course",  "availableSlots": 23}' \http://localhost:8080/api/courses
  curl \--request POST \--data '"Id” : “1234”,   "name": "maths",  "description": "This is mathematics course",  "availableSlots": 23' \http://localhost:8080/api/courses
  // curl \--request POST \--data '{"id":1}' \http://localhost:8080/api/courses
  */
  .post(function (req, res) {
    var t = req.body;
    var data = JSON.parse(t);
    var courses = require("./courses.json");
    courses = courses.data;
    courses[courses.length] = data;
    res.send("{success: true}");
  })
  
  .get(function (req, res) {
    var courses = require("./courses.json");
    // console.log(courses);

    res.send(courses);
  });

router
  .route("/courses/:courses_id")

  .get(function (req, res) {
    var courses = require("./courses.json");
    // console.log(courses);
    // var id=JSON.parse(courses);
    // console.log(courses);
    var ob = req.params.courses_id;
    var id = courses.data;
    for (let i = 0; i < id.length; i++) {
      const element = id[i];
      if (ob == element.id) {
        return res.send(element);
      }
    }
    res.send("Course not found");
  });

router
  .route("/students")

  .post(function (req, res) {})

  .get(function (req, res) {
    var students = require("./students.json");
    // console.log(courses);
    res.send(students);
  });

// curl http://localhost:8080/api/courses
