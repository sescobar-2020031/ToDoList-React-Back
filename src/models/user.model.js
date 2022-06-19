'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    tasks: [{
        task: {type: mongoose.Schema.ObjectId, ref: 'Task'}
    }]
});

module.exports = mongoose.model('User', userSchema);