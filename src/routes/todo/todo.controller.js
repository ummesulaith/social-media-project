const Todo = require('../../models/todo/todo.model')
const { getPagination } = require('../../services/query')

async function httpCreateToDo(req, res) {
    let todo = req.body
    if (!todo.title) {
        return res.status(400).json({
            error: 'Missing required todo details',
        })
    }
    let id = await Todo.getLatestToDoNumber()
    let result = await Todo.createTodo(todo, req.user, id)
    return res.status(201).json(result)
}

async function httpGetToDo(req, res) {
    const { skip, limit } = getPagination(req.query)
    let filter= req.query
    delete filter.skip
    delete filter.limit
    const todos = await Todo.getAllTodos(filter,skip, limit)
    return res.status(200).json(todos)
}

async function httpUpdateToDo(req, res) {
    const todoId = Number(req.params.id)
    const todoBody = req.body
    if (!Object.keys(todoBody).length || !todoId) {
        return res.status(400).json({
            error: 'Missing required todo details',
        })
    } else {
        let existsTodo = await Todo.existsTodoWithId(todoId)
        if (!existsTodo) {
            return res.status(404).json({
                error: 'TODO not found'
            })
        } else {
            let authorizedUser = await Todo.checkUserAccess(req.user,existsTodo)
            if(authorizedUser){
            const updateTodo = await Todo.updateToDoById(todoId,todoBody)
            let result = await Todo.existsTodoWithId(todoId)
            return res.status(200).json({ result })}
            else{
                return res.status(401).send({message:'User not authorized to update'})
            }
        }
    }
}

async function httpDeleteToDo(req, res) {
    const todoId = Number(req.params.id)
    if ( !todoId) {
        return res.status(400).json({
            error: 'Missing required todo details',
        })
    } else {
        let existsTodo = await Todo.existsTodoWithId(todoId)
        if (!existsTodo) {
            return res.status(404).json({
                error: 'TODO not found'
            })
        } else {
            let authorizedUser = await Todo.checkUserAccess(req.user,existsTodo)
            if(authorizedUser){
            const deleteTodo = await Todo.deleteToDoById(todoId)
            return res.status(200).json({ result: "ok" })
            }else{
                return res.status(401).send({message:'User not authorized to update'})
            }
        }
    }
}


module.exports = {
    httpCreateToDo,
    httpGetToDo,
    httpUpdateToDo,
    httpDeleteToDo
}