'use strict'

//Import Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require ('cors');

//Import the Routes//
const userRoutes = require('../src/routes/user.routes');
const taskRoutes = require('../src/routes/task.routes');

//APP -> HTTP Server (Express)
const app = express(); //Create Express Server

/*----- SERVER CONFIGURATION ---------*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet({}));
app.use(cors());

app.use('/user', userRoutes);
app.use('/task', taskRoutes);

//Export//
module.exports = app;