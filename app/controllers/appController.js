'use strict';
var Task = require('../models/app.model.js');
var bcrypt = require('bcrypt');
var BCRYPT_SALT_ROUNDS = require('../config/auth.config').BCRYPT_SALT_ROUNDS;
const accessTokenSecret = require("../config/auth.config").secret;
const jwt = require("jsonwebtoken");

exports.addUser = function (req, res) {
    var new_task = new Task(req.body);

    if (!new_task.first_name || !new_task.last_name || !new_task.email || !new_task.password || !new_task.username) {

        res.status(400).send({
            error: true,
            message: 'Please provide data'
        });

    } else {
        Task.findUser(new_task.username, function (errr, result) {
            if (result !== null)
                return res.status(400).json({
                    error: "user name already exist"
                });
            else
                Task.findUserEmail(new_task.email, function (errrr, resu) {
                    if (resu !== null)
                        return res.status(400).json({
                            error: "email already exist"
                        });
                    Task.addStudent(new_task, function (err, task) {
                        if (task !== null)
                            return res.status(200).json({
                                message: "signup successful"
                            });
                        else
                            return res.status(500).send(err);
                    });
                });
        });
    }
};

exports.login = function (req, res) {
    var new_task = new Task(req.body);
    Task.findUser(new_task.username, function (errr, result) {
        if (result !== null) {
            var opassword = result.password;
            if (bcrypt.compareSync(new_task.password, opassword)) {
                console.log(`user found & logged in ${new_task.username}`);
                var token = jwt.sign({
                    id: new_task.username
                }, accessTokenSecret, {
                    expiresIn: 86400,
                });
                return res.status(200).json({
                    auth: true,
                    id: result.id,
                    bearer: token,
                    message: 'user found & logged in'
                });
            } else {
                return res.status(400).json({
                    error: "password does not match"
                });
            }
        } else {
            return res.status(400).json({
                error: "username not found"
            });
        }
    });
};

exports.getUsers = function (req, res) {
    Task.getAllUser(function (err, result) {
        if (err !== null) return res.status(500).json({
            error: "Internal db error"
        });
        console.log(`request all user ${result}`);
        var students = [];
        result.forEach(element => {
            students[students.length] = {
                id: element.id,
                username: element.username
            };
        });
        return res.status(200).send({
            Students: students,
            success: true
        });
    });
};

exports.getCourses = function (req, res) {
    Task.getAllCourses(async function (err, result) {
        if (err !== null) return res.status(500).json({
            error: "Internal db error"
        });
        var courserow = [];
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            var enrollsid = [];
            enrollsid = await Task.getenrolled(element.id);
            courserow.push({
                id: element.id,
                name: element.name,
                description: element.description,
                enrolledStudents: enrollsid,
                available_slots: element.available_slots
            });
        }
        console.log(`request all user ${result} sent- ${courserow}`);
        return res.status(200).send({
            Courses: courserow,
            success: true
        });
    });
};

exports.getCourseById = function (req, res) {
    Task.findCourseById(+req.params.courses_id, async function (err, result) {
        if (err !== null) return res.status(500).json({
            error: "Internal db error"
        });
        if (result === null) return res.status(402).json({
            message: "Course not found"
        });
        var courserow;
        var enrollsid = [];
        enrollsid = await Task.getenrolled(result.id);
        courserow = {
            id: result.id,
            name: result.name,
            description: result.description,
            enrolledStudents: enrollsid,
            available_slots: result.available_slots
        };
        console.log(`request all user ${courserow}`);
        return res.status(200).send({
            Courses: courserow,
            success: true
        });
    });
};

exports.addCourse = function (req, res) {
    var new_task = new Task(req.body);

    if (!new_task.name || !new_task.available_slots || !new_task.description) {
        res.status(400).send({
            error: true,
            message: 'Please provide data'
        });

    } else {
        Task.findCourse(new_task.name, function (errr, result) {
            if (result !== null)
                return res.status(400).json({
                    error: "Course already exist"
                });
            else
                Task.addCourse(new_task, function (err, task) {
                    if (task !== null)
                        return res.status(200).json({
                            message: "course addded successful",
                            success: true
                        });
                    else
                        return res.status(500).send(err);
                });

        });
    }
};

exports.enroll = function (req, res) {
    Task.findCourseById(+req.params.courses_id, function (err, courseId) {
        if (err !== null) return res.status(500).json({
            error: "Internal db error"
        });
        if (courseId === null) return res.status(402).json({
            message: "Course not found"
        });
        if (courseId.available_slots === 0) return res.status(402).json({
            message: "Course solts are full"
        });
        Task.findUserById(req.body.studentId, function (err2, UserId) {
            if (err2 !== null) return res.status(500).json({
                error: "Internal db error2",
            });
            if (UserId === null) return res.status(402).json({
                message: "User not found"
            });
            if (UserId.username !== req.user.id) return res.status(403).json({
                message: "Can't enroll someone else"
            });
            Task.enroll(courseId.id, UserId.id, function (err3, enrollrow) {
                if (err3 !== null) {
                    console.log(`error`, err3);
                    return res.status(500).json({
                        error: "Internal db error"
                    });
                }
                if (enrollrow[1] === false) return res.status(402).json({
                    message: "Already Enrolled"
                });
                console.log('erolled ${enrollrow[0]}');
                courseId.available_slots = courseId.available_slots - 1;
                courseId.save();
                return res.status(200).json({
                    message: "Successfully Enrolled",
                    success: true
                });
            });
        });
    });
};

exports.disenroll = function (req, res) {
    Task.findCourseById(+req.params.courses_id, function (err, courseId) {
        if (err !== null) return res.status(500).json({
            error: "Internal db error"
        });
        if (courseId === null) return res.status(402).json({
            message: "Course not found"
        });
        Task.findUserById(req.body.studentId, function (err2, UserId) {
            if (err2 !== null) return res.status(500).json({
                error: "Internal db error",
            });
            if (UserId === null) return res.status(402).json({
                message: "User not found"
            });
            if (UserId.username !== req.user.id) return res.status(403).json({
                message: "Can't disenroll someone else"
            });
            Task.disenroll(courseId.id, UserId.id, function (err3, disenrollrow) {
                if (err3 !== null) {
                    console.log(`error`, err3);
                    return res.status(500).json({
                        error: "Internal db error"
                    });
                }
                if (disenrollrow !== 1) return res.status(402).json({
                    message: "Not Enrolled"
                });
                console.log('diserolled ${disenrollrow}');
                courseId.available_slots = courseId.available_slots + 1;
                courseId.save();
                return res.status(200).json({
                    message: "Successfully Disenrolled",
                    success: true
                });
            });
        });
    });
};