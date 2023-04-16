const express = require('express'),
 userController = require('./user.controller'), 
 userRouter = express.Router(),
  auth = require("../auth")

 userRouter.post('/register',userController.httpRegisterUser)
 userRouter.post('/login',userController.httpLoginUser)
 userRouter.get('/home',auth, userController.httpHomePage)

 module.exports =  userRouter
