'user strict';
var bcrypt = require('bcrypt');
var User = require('./index').user;
var BCRYPT_SALT_ROUNDS = 12;
//Task object constructor
var Task = function (task) {
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

module.exports = Task;