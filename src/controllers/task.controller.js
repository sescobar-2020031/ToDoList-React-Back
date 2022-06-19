'use strict'

const { validateData, checkUpdate } = require('../utils/validate');
const Task = require('../models/task.model');
const User = require('../models/user.model')

exports.addTask = async (req, res)=>{
    try{
        const params = req.body;
        const userId = req.user.sub
        const data = {
            title: params.title,
            description: params.description,
            priority: params.priority,
            complete: false
        }
        const msg = await validateData(data);
        if(msg) return res.status(400).send(msg);
        let taskSave = new Task(data);
        await taskSave.save();
        const updateUser = await User.findOneAndUpdate({_id: userId}, {$push: {tasks: {task: taskSave._id}}}, {new:true});
        if(!updateUser)return res.status(400).send({message: 'Task could not be added'});
        return res.send({message: 'Task create successfully', taskSave});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving task'});
    }
}

exports.getTasks = async(req, res)=>{
    try{
       const userId = req.user.sub
       const usertasks = await User.findOne({_id: userId}).populate('tasks.task');
       if(!usertasks) return res.status(400).send({message: 'Tasks not found'});
       const tasks = usertasks.tasks
       return res.send({message: 'Tasks found successfully', tasks});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting tasks'});
    }
}

exports.getTask = async(req, res)=>{
    try{
        const taskId = req.params.id;
        const task = await Task.findOne({_id: taskId});
        if(!task) return res.status(400).send({message: 'Task not found'});
        return res.send({task});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting task'});
    }
}

exports.updateTask = async (req, res)=>{
    try{
        const taskId = req.params.id;
        const params = req.body;
        const validateUpdate = await checkUpdate(params);
        if(!validateUpdate) return res.status(400).send({message: 'Empty params'});
        const taskUpdate = await Task.findOneAndUpdate({_id: taskId},params,{new:true});
        if(!taskUpdate)  return res.status(400).send({message: 'Tasks not found'});
        return res.send({message: 'Task updated successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error updating task'});
    }
}

exports.deleteTask = async(req, res)=>{
    try{
        const userId = req.user.sub
        const taskId = req.params.id;
        const taskDelete = await Task.findOneAndDelete({_id: taskId});
        if(!taskDelete)  return res.status(400).send({message: 'Tasks not found'});
        console.log(taskDelete._id)
        const updateTaskOfUser = await User.findOneAndUpdate({_id: userId}, {$pull: {'tasks': {'task': taskDelete._id}}}, {new:true});
        if(!updateTaskOfUser)return res.status(400).send({message: 'Task could not be Deleted'});
        return res.send({message: 'Task deleted successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting task'});
    }
}