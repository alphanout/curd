const accessTokenSecret = require("../config/auth.config").secret;
const cont = require("../controllers/appController");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
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
            res.status(401).send({
                error: "Unauthorized"
            });
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
            cont.addCourse(req, res);
        })
        .get(function (req, res) {
            cont.getCourses(req, res);
        });

    router
        .route("/courses/:courses_id")
        .get(function (req, res) {
            if (isNaN(+req.params.courses_id)) return res.status(400).json({
                error: "invalid type of course id"
            });
            cont.getCourseById(req, res);
        });

    router
        .route("/students")
        .get(function (req, res) {
            cont.getUsers(req, res);
        });

    router
        .route("/courses/:courses_id/enroll")
        .post(function (req, res) {
            if (isNaN(+req.params.courses_id)) return res.status(400).json({
                error: "invalid type of course id"
            });
            var data = req.body.studentId;
            if (!Number.isInteger(data)) return res.status(400).json({
                error: "invalid type of student id"
            });
            cont.enroll(req, res);
        });

    router
        .route("/courses/:courses_id/deregister")
        .post(function (req, res) {
            if (isNaN(+req.params.courses_id)) return res.status(400).json({
                error: "invalid type of course id"
            });
            var data = req.body.studentId;
            if (!Number.isInteger(data)) return res.send("invalid body");
            cont.disenroll(req, res);
        });

    app.use("/api", authenticateJWT, router);
};