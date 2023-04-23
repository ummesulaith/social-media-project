const todoDatabase = require('./todo.model.mongo.schema'),
userDatabase = require('../user/user.model.mongo.schema'),
 DEFAULT_TODO_ID = 1

async function createTodo(todo, user, id) {
    const todoData = await todoDatabase.create({
        userId: user.id,
        id: id,
        title: todo.title,
        completed: false
    });
    return await todoDatabase.find({id: todoData.id}, {
        '_id': 0, '__v': 0
    })

}

async function getLatestToDoNumber() {
    const latestTodoId = await todoDatabase.findOne({})
        .sort('-id')
    if (!latestTodoId) {
        return DEFAULT_TODO_ID
    }
    return latestTodoId.id + 1
}

async function getAllTodos(filter, skip, limit) {
    if (!Object.keys(filter).length) {
        return await todoDatabase.find({}, {
            '_id': 0, '__v': 0
        })
            .sort({ id: 1 })
            .skip(skip)
            .limit(limit)      
    }else{
        return await todoDatabase.find(filter, {
            '_id': 0, '__v': 0
        })
            .sort({ id: 1 })
            .skip(skip)
            .limit(limit)  
    }
}
async function existsTodoWithId(todoId) {
    return await findTodo({
        id: todoId
    })
}
async function findTodo(filter) {
    return await todoDatabase.findOne(filter, {
        '_id': 0, '__v': 0
    })
}

async function updateToDoById(id,filter) {
    let updateResult = await todoDatabase.updateOne({ id: id },{$set: filter})
    return updateResult.modifiedCount === 1;
}

async function deleteToDoById(id) {
    let deleteResult = await todoDatabase.deleteOne({ id: id })
    return deleteResult.modifiedCount === 1;
}

async function checkUserAccess(currentUser,authorizedUser){
    let requestedEditUser = await getUserDetails({ email: currentUser.email })
    if (requestedEditUser._id == authorizedUser.userId) return true
    else return false

}

async function getUserDetails(filter) {
    return await userDatabase.findOne(filter, {
        '__v': 0
    })
}

module.exports = {
    createTodo,
    getLatestToDoNumber,
    getAllTodos,
    existsTodoWithId,
    updateToDoById,
    deleteToDoById,
    checkUserAccess
}