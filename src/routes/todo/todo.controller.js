const { createTodo, getLatestToDoNumber, getAllTodos, existsTodoWithId, updateToDoById } = require('../../../models/todo/todo.model')
const { getPagination } = require('../../services/query')

async function httpCreateToDo(req, res) {
    let todo = req.body
    console.log('check for header', req.user)
    if (!todo.title || !todo.description) {
        return res.status(400).json({
            error: 'Missing required todo details',
        })
    }
    let id = await getLatestToDoNumber()
    let result = await createTodo(todo, req.user, id)
    return res.status(201).json(result)
}

async function httpGetToDo(req, res) {
    const { skip, limit } = getPagination(req.query)
    const todos = await getAllTodos(skip, limit)
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
        let existsTodo = await existsTodoWithId(todoId)
        if (!existsTodo) {
            return res.status(404).json({
                error: 'TODO not found'
            })
        } else {
            const updateTodo = await updateToDoById(todoBody)
            let result = await existsTodoWithId(todoId)
            return res.status(200).json({ result })
        }
    }
}

module.exports = {
    httpCreateToDo,
    httpGetToDo,
    httpUpdateToDo
}