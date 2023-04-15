const express = require('express'),
userRouter = require('./user/user.routes');

api = express.Router()
api.use('/user', userRouter)

module.exports = api