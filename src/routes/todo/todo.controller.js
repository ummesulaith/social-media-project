const{ createTodo,getLatestToDoNumber,getAllTodos } = require('../../../models/todo/todo.model')
const { getPagination} = require('../../services/query')

async function httpCreateToDo(req, res) {
    let todo = req.body
    console.log('check for header',req.user)
    if (!todo.title || !todo.description) {
        return res.status(400).json({
            error: 'Missing required todo details',
        })
    }
    let id = await getLatestToDoNumber()
    let result = await createTodo(todo,req.user,id)
    return res.status(201).json(result)
}

async function httpGetToDo(req,res){
    const { skip, limit } = getPagination(req.query)
    const todos = await getAllTodos(skip,limit)
    return res.status(200).json(todos)
}

async function httpUpdateToDo(req,res){

}

module.exports = {
    httpCreateToDo,
    httpGetToDo,
    httpUpdateToDo
}