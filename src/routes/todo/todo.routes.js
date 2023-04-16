const express = require('express'),
 todoController = require('./todo.controller'), 
 todoRouter = express.Router(),
  auth = require("../auth")

  todoRouter.post('/create',auth,todoController.httpCreateToDo)
  todoRouter.get('/',auth,todoController.httpGetToDo)
  todoRouter.put('/:id',auth,todoController.httpUpdateToDo)
  todoRouter.delete('/:id',auth,todoController.httpDeleteToDo)



//   todoRouter.get('/home',auth, userController.httpHomePage)

 module.exports =  todoRouter
