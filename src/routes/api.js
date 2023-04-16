const express = require('express'),
userRouter = require('./user/user.routes'),
todoRouter = require('./todo/todo.routes');

api = express.Router()
api.use('/user', userRouter)
api.use('/todo', todoRouter)

module.exports = api