'use strict';

//Import mongod Config File - Connect to MongoDB
const mongoConfig = require('./configs/mongoConfig');

//Import Encryption//
const {encryptPassword, findUser} = require('./src/utils/validate');

//Importación del Modelo de Usuario//
const User = require('./src/models/user.model');

//Express Server Import
const app = require('./configs/app');

//Import the Port in a Constant
const port = 3200 || process.env.PORT;

mongoConfig.init();

app.listen(port, async ()=>
{
    console.log(`Server HTTP running in port ${port}.`);

    const automaticUser = 
    {
        name: 'ADMIN',
        surname: 'ADMIN',
        email: 'admin@gmail.edu.gt',
        password: await encryptPassword('123'),
        role: 'ADMIN'
    }

    const searchUserAdmin = await findUser(automaticUser.email);
    if(!searchUserAdmin)
    {
        let userAdmin = new User(automaticUser);
        await userAdmin.save();
        console.log('User Admin register Successfully.')
    }

});