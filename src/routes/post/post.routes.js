const express = require('express'),
  postController = require('./post.controller'),
  postRouter = express.Router(),
  auth = require("../auth")

postRouter.post('/', auth, postController.httpCreatePost)
postRouter.get('/', auth, postController.httpGetAllPost)
postRouter.put('/:id', auth, postController.httpUpdatePost)


module.exports = postRouter
