const userDatabase = require('./user.model.mongo.schema'),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken");
require('dotenv').config()

async function signup(user) {
    const encryptedPassword = await bcrypt.hash(user.password, 10);
    const userData = await userDatabase.create({
        name: user.name,
        email: user.email.toLowerCase(),
        password: encryptedPassword
    });
    
    return await userDatabase.find({id: userData.id}, {
        '_id': 0, '__v': 0
    })

}

async function existUser(email) {
    let isUserExist = await userDatabase.findOne({ email });
    return isUserExist

}

async function generateToken(id, email) {
    const token = jwt.sign(
        { id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
    return token;
}

async function validatePassword(user, password) {
    let data = {}
    let isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return false
    else {
        let token = await generateToken(user._id, user.email)
        data.email = user.email
        data.token = token
        return { message: "Logged In Successfully", data }

    }
}

async function getAllUsers(skip,limit) {
    return await userDatabase.find({}, {
        '_id': 0, '__v': 0,'password': 0
    })
    .sort({id: 1})
    .skip(skip)
    .skip()
    .limit(limit)
    
}

module.exports = {
    validatePassword,
    existUser,
    signup,
    getAllUsers
}