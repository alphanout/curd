'user strict';
var sql = require('../../db.js');
var bcrypt = require('bcrypt');
var User = require('./index').user;
var BCRYPT_SALT_ROUNDS = 12;
//Task object constructor
var Task = function (task, accessToken) {
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
            }).then((err) => {
                console.log('user created in db');
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    console.log(res.insertId);
                    result(null, res.insertId);
                }
            });
        });
};

Task.getTaskById = function (taskId, result) {
    sql.query("Select task from tasks where id = ? ", taskId, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            result(null, res);

        }
    });
};
Task.getAllTask = function (result) {
    sql.query("Select * from tasks", function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            console.log('tasks : ', res);

            result(null, res);
        }
    });
};
Task.updateById = function (id, task, result) {
    sql.query("UPDATE tasks SET task = ? WHERE id = ?", [task.task, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
Task.remove = function (id, result) {
    sql.query("DELETE FROM tasks WHERE id = ?", [id], function (err, res) {

        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {

            result(null, res);
        }
    });
};

module.exports = Task;