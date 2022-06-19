'use strict'

const User = require('../models/user.model');
const jwt = require('../services/jwt');
const { validateData, findUser, checkPassword, encryptPassword} = require('../utils/validate');


exports.register = async(req, res)=>{
    try{
        const params = req.body;
        let data = {
            name: params.name,
            surname: params.surname,
            email: params.email,
            password: params.password,
        };
        let msg = await validateData(data);
        if(msg) return res.status(400).send(msg);
        let userExist = await findUser(data.email);
        if(userExist) return res.status(400).send({message: 'Email already in use'});
        else {
            data.password = await encryptPassword(params.password);
            let user = new User(data);
            await user.save();
            if(!user) return res.status(400).send({message: 'Could not register user'});
            return res.send({message: 'User created successfully', user});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving user'});
    }
}

exports.login = async(req, res)=>{
    try{
        const params = req.body;
        let data = {
            email: params.email,
            password: params.password
        }
        let msg = await validateData(data);
        if(msg) return res.status(400).send(msg);
        let userExist = await findUser(data.email);
        if(userExist && await checkPassword(data.password, userExist.password)){
            let token = await jwt.createToken(userExist);
            delete userExist.password;
            return res.send({token, message: `Login successfuly, welcome ${userExist.name}`, user: userExist});
        }else return res.status(400).send({message: 'Invalid credentials'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Failed to login'});
    }
}
