const userDatabase = require('./user.model.mongo.schema'),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken");
require('dotenv').config()

async function signup(user) {
    let data = {}
    const encryptedPassword = await bcrypt.hash(user.password, 10);
    const userData = await userDatabase.create({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword
    });
    let token = await generateToken(userData._id, userData.email)
    data.first_name = userData.first_name
    data.last_name = userData.last_name
    data.email = userData.email
    data.token = token
    console.log('data saving ', data)

    return data
}

async function existUser(email) {
    let isUserExist = await userDatabase.findOne({ email });
    console.log('isuser', isUserExist)
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
    console.log('isPAssword ', isPasswordValid)
    if (!isPasswordValid) return false
    else {
        let token = await generateToken(user._id, user.email)
        data.email = user.email
        data.token = token
        return { message: "Logged In Successfully", data }

    }


}

module.exports = {
    validatePassword,
    existUser,
    signup
}