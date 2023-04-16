const todoDatabase = require('./todo.model.mongo.schema')
const DEFAULT_TODO_ID = 1

async function createTodo(todo,user,id){
    let data = {}
    const todoData = await todoDatabase.create({
        userId: user.id,
        id: id,
        title: todo.title, 
        description: todo.description,
        completed: false
    });
    data.userId = todoData.userId
    data.id = todoData.id
    data.title = todoData.title
    data.description = todoData.description
    data.completed = todoData.completed
    data.createdAt = todoData.createdAt
   console.log('todo data', data)
   return data

}

async function getLatestToDoNumber() {
    const latestTodoId = await todoDatabase.findOne({})
        .sort('-id')
    console.log('latest to do', latestTodoId)
    if (!latestTodoId) {
        return DEFAULT_TODO_ID
    }
    return latestTodoId.id + 1
}

async function getAllTodos(skip,limit) {
    return await todoDatabase.find({}, {
        '_id': 0, '__v': 0
    })
    .sort({id: 1})
    .skip(skip)
    .limit(limit)
    
}

module.exports={
    createTodo,
    getLatestToDoNumber,
    getAllTodos
}