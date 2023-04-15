const userDatabase = require('./user.model.mongo.schema'),
 bcrypt = require("bcryptjs");

async function signup(user){
    const encryptedPassword = await bcrypt.hash(user.password, 10);
    const userData = await userDatabase.create({
       first_name: user.first_name,
        last_name: user.last_name,
        email: user.email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword
    });
    console.log('data saving ', userData)
   return userData
}

async function existUser(email){
    let isUserExist = await userDatabase.findOne({ email });
    console.log('controller ', isUserExist)
    return isUserExist
}

module.exports={
    existUser,
    signup
}