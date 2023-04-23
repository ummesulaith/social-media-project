const express = require('express'),
 todoController = require('./todo.controller'), 
 todoRouter = express.Router(),
  auth = require("../auth")

  todoRouter.post('/',auth,todoController.httpCreateToDo)
  todoRouter.get('/',auth,todoController.httpGetToDo)
  todoRouter.put('/:id',auth,todoController.httpUpdateToDo)
  todoRouter.delete('/:id',auth,todoController.httpDeleteToDo)

 module.exports =  todoRouter
