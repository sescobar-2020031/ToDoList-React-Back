'use strict'

const express = require('express');
const api = express.Router();

const taskController = require('../controllers/task.controller');
const mdAuth = require('../middlewares/authenticated');

api.post('/addTask', mdAuth.ensureAuth, taskController.addTask);
api.get('/getTasks', mdAuth.ensureAuth, taskController.getTasks);
api.get('/getTask/:id', mdAuth.ensureAuth, taskController.getTask);
api.put('/updateTask/:id', mdAuth.ensureAuth, taskController.updateTask);
api.delete('/deleteTask/:id', mdAuth.ensureAuth, taskController.deleteTask);

module.exports = api;