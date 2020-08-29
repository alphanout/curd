'user strict';
var bcrypt = require('bcrypt');
var User = require('./index').user;
const {
    Op
} = require("sequelize");
var Course = require('./index').course;
var student_enrolled = require('./index').student_enrolled;
var BCRYPT_SALT_ROUNDS = require('../config/auth.config').BCRYPT_SALT_ROUNDS;

//Task object constructor
var Task = function (task) {
    this.name = task.name;
    this.description = task.description;
    this.available_slots = task.available_slots;
    this.first_name = task.first_name;
    this.last_name = task.last_name;
    this.email = task.email;
    this.username = task.username;
    this.password = task.password;
};
Task.addStudent = function (newTask, result) {
    bcrypt
        .hash(newTask.password, BCRYPT_SALT_ROUNDS)
        .then(function (hashedPassword) {
            User.create({
                first_name: newTask.first_name,
                last_name: newTask.last_name,
                email: newTask.email,
                username: newTask.username,
                password: hashedPassword,
            }).then((data) => {
                console.log('user created in db');
                if (data) {
                    console.log("row: ", data);
                    result(null, data);
                }
            }).catch(err => {
                result(err, null);
            });
        });
};
Task.findUser = function (usernamef, result) {
    User.findOne({
        where: {
            username: usernamef
        }
    }).then((err) => {
        result(null, err);
    }).catch((err) => {
        result(err, null);
    });
};
Task.findUserEmail = function (emailf, result) {
    User.findOne({
        where: {
            email: emailf
        }
    }).then((err) => {
        result(null, err);
    }).catch((err) => {
        result(err, null);
    });
};

Task.getAllUser = function (result) {
    User.findAll().then(data => {
        result(null, data);
    }).catch(err => result(err, null));
};

Task.getAllCourses = function (result) {
    Course.findAll().then(data => {
        result(null, data);
    }).catch(err => result(err, null));
};

Task.addCourse = function (newTask, result) {
    Course.create({
        name: newTask.name,
        available_slots: newTask.available_slots,
        description: newTask.description
    }).then((data) => {
        console.log('Course added in db');
        if (data) {
            console.log("row: ", data);
            result(null, data);
        }
    }).catch(err => {
        result(err, null);
    });
};
Task.findCourseById = function (key, result) {
    Course.findByPk(key).then((data) => {
        result(null, data);
    }).catch((err) => {
        result(err, null);
    });
};
Task.findUserById = function (key, result) {
    User.findByPk(key).then((data) => {
        result(null, data);
    }).catch((err) => {
        result(err, null);
    });
};

Task.findCourse = function (key, result) {
    Course.find({
        where: {
            name: key
        }
    }).then((data) => {
        result(null, data);
    }).catch((err) => {
        result(err, null);
    });
};

Task.enroll = function (courseId, Userid, result) {
    student_enrolled.findOrCreate({
        where: {
            [Op.and]: [{
                    userId: Userid
                },
                {
                    courseId: courseId
                }
            ]
        },
        defaults: {
            userId: Userid,
            courseId: courseId
        }
    }).then((usr) => {
        result(null, usr);
    }).catch((err) => {
        result(err, null);
    });
};

Task.getenrolled = function (courseId, result) {
    student_enrolled.findAll({
        where: {
            courseId: courseId
        }
    }).then((usr) => {
        result(null, usr);
    }).catch((err) => {
        result(err, null);
    });
};

Task.disenroll = function (courseId, Userid, result) {
    student_enrolled.destroy({
        where: {
            [Op.and]: [{
                    userId: Userid
                },
                {
                    courseId: courseId
                }
            ]
        }
    }).then((usr) => {
        result(null, usr);
    }).catch((err) => {
        result(err, null);
    });
};
module.exports = Task;