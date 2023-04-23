const express = require('express'),
userRouter = require('./user/user.routes'),
todoRouter = require('./todo/todo.routes'),
postRouter = require('./post/post.routes')


api = express.Router()
api.use('/user', userRouter)
api.use('/todo', todoRouter)
api.use('/post', postRouter)

module.exports = api