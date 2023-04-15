const express = require('express'),
 userSignUpController = require('./user.controller'),
 userRouter = express.Router()

 userRouter.post('/',userSignUpController.httpaddNewUser)

 module.exports =  userRouter
