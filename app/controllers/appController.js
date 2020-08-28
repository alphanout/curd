'use strict';
var Task = require('../models/app.model.js');

exports.list_all_tasks = function (req, res) {
    Task.getAllTask(function (err, task) {

        console.log('controller');
        if (err)
            res.send(err);
        console.log('res', task);
        res.send(task);
    });
};



exports.addUser = function (req, res, accessToken) {
    var new_task = new Task(req.body, accessToken);

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
                Task.addStudent(new_task, function (err, task) {
                    if (err)
                        res.send(err);
                    else
                        res.json(task.accessToken);
                });
        });
    }
};


exports.findUser = function (req, res) {
    Task.getTaskById(req.params.taskId, function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.update_a_task = function (req, res) {
    Task.updateById(req.params.taskId, new Task(req.body), function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};


exports.delete_a_task = function (req, res) {


    Task.remove(req.params.taskId, function (err, task) {
        if (err)
            res.send(err);
        res.json({
            message: 'Task successfully deleted'
        });
    });
};