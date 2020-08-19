module.exports = (app, jwt, accessTokenSecret) => {
    // const tutorials = require("../controllers/controller.js");
    var router = require("express").Router();
    const authenticateJWT = (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }

                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    };

    router.get("/", function (req, res) {
        res.json({
            message: "hooray! welcome to our api!"
        });
    });

    router
        .route("/courses")
        .post(function (req, res) {
            const fs = require("fs");
            var data = req.body;
            var courses = require("../../courses.json");
            if (!Number.isInteger(data.id)) return res.send("invalid id");
            for (let i = 0; i < courses.data.length; i++) {
                if (courses.data[i].id == data.id) return res.send("course exist");
            }
            courses.data[courses.data.length] = data;

            fs.writeFile("./courses.json", JSON.stringify(courses), (err) => {
                if (err) throw err;
                console.log("Done writing");
            });
            res.send("{success: true}");
        })
        .get(function (req, res) {
            var courses = require("../../courses.json");

            res.send(courses.data);
        });

    router
        .route("/courses/:courses_id")
        .get(function (req, res) {
            var courses = require("../../courses.json");
            var ob = req.params.courses_id;
            if (Number.isInteger(ob)) return res.send("invalid input");
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
        .post(function (req, res) {
            const fs = require("fs");
            var data = req.body;
            if (typeof req.body.name != typeof "") return res.send("invalid input");
            var courses = require("../../students.json");
            data["id"] = courses.data.length;
            courses.data[courses.data.length] = data;

            fs.writeFile("./students.json", JSON.stringify(courses), (err) => {
                if (err) console.log(err);
                console.log("Done writing");
            });

            // tutorials.create(req,res);
            console.log("done sql");
            res.send("{success: true}");
        })
        .get(function (req, res) {
            var students = require("../../students.json");
            // console.log(courses);
            res.send(students.data);
        });

    router
        .route("/courses/:courses_id/enroll")
        .post(function (req, res) {
            const fs = require("fs");
            var data = req.body.studentId;
            if (!Number.isInteger(data)) return res.send("invalid input");
            var courses = require("../../courses.json");
            var c = courses.data[req.params.courses_id - 1];
            if (c.available_slots > 0) {
                var p = {};
                p["id"] = data;
                for (let i = 0; i < c.enrolledStudents.length; i++) {
                    if (c.enrolledStudents[i].id == data) {
                        return res.send("Already enrolled");
                    }
                }
                c.enrolledStudents.push(p);
                c.available_slots = c.available_slots - 1;
            } else {
                return res.send("no slots available");
            }
            fs.writeFile("./courses.json", JSON.stringify(courses), (err) => {
                if (err) throw err;
                console.log("Done writing");
            });
            res.send("{success: true}");
        });

    router
        .route("/courses/:courses_id/deregister")
        .post(function (req, res) {
            const fs = require("fs");
            var data = req.body.studentId;
            if (!Number.isInteger(data)) return res.send("invalid input");
            var courses = require("../.../../courses.json");
            var c = courses.data[req.params.courses_id - 1];
            var b = false;
            for (let i = 0; i < c.enrolledStudents.length; i++) {
                if (c.enrolledStudents[i].id == data) {
                    c.enrolledStudents.splice(i, 1);
                    b = true;
                }
            }
            if (!b) {
                return res.send("No student found.");
            }
            c.available_slots = c.available_slots + 1;

            fs.writeFile("./courses.json", JSON.stringify(courses), (err) => {
                if (err) throw err;
                console.log("Done writing");
            });
            res.send("{success: true}");
        });
    app.use("/api", authenticateJWT, router);
};