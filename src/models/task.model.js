'use strict'

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: String,
    description: String,
    priority: Number,
    complete: Boolean
});

module.exports = mongoose.model('Task', taskSchema);