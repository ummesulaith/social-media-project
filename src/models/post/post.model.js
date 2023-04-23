const postDatabase = require('./post.model.mongo.schema'),
    userDatabase = require('../user/user.model.mongo.schema'),
    DEFAULT_POST_ID = 1

async function createPost(post, user, id) {
    let Newcomments = {}, postData
    let createdby = await getUserDetails({ email: user.email })
    if (post.comments && post.comments.length > 0) {
        Newcomments.userId = user.id
        Newcomments.email = user.email
        Newcomments.comment = post.comments

        postData = await postDatabase.create({
            userId: user.id,
            id: id,
            createdby: createdby.name,
            title: post.title,
            body: post.body,
            comments: Newcomments
        });
        return await postDatabase.find({ id: postData.id }, {
            '_id': 0, '__v': 0
        })
    } else {
        postData = await postDatabase.create({
            userId: user.id,
            id: id,
            createdby: createdby.name,
            title: post.title,
            body: post.body
        });


        return await postDatabase.find({ id: postData.id }, {
            '_id': 0, '__v': 0
        })


    }

}

async function getUserDetails(filter) {
    return await userDatabase.findOne(filter, {
        '__v': 0
    })
}

async function getLatestPostNumber() {
    const latestPostId = await postDatabase.findOne({})
        .sort('-id')
    if (!latestPostId) {
        return DEFAULT_POST_ID
    }
    return latestPostId.id + 1
}

async function getAllPosts(filter, skip, limit) {
    if (!Object.keys(filter).length) {
        return await postDatabase.find({}, {
            '_id': 0, '__v': 0
        })
            .sort({ id: 1 })
            .skip(skip)
            .limit(limit)
    } else {
        return await postDatabase.find(filter, {
            '_id': 0, '__v': 0
        })
            .sort({ id: 1 })
            .skip(skip)
            .limit(limit)
    }
}

async function existsPostWithId(postId) {
    return await findPost({
        id: postId
    })
}
async function findPost(filter) {
    return await postDatabase.findOne(filter, {
        '_id': 0, '__v': 0
    })
}

async function updatePost(post, user, existsPost) {
    let updateResult, newComments = {}
    let requestedEditUser = await getUserDetails({ email: user.email })
    if (requestedEditUser._id == existsPost.userId) {
        if (post.comments) {
            newComments.userId = user.id
            newComments.email = user.email
            newComments.comment = post.comments
            post.comments = newComments

            let updatecomments = await addComments(existsPost.id, post.comments)
            if (updatecomments.modifiedCount === 1) delete post.comments
        }
        updateResult = await postDatabase.updateOne({ id: existsPost.id }, { $set: post })
        return updateResult.modifiedCount === 1;
    } else {
        if (post.title || post.body) {
            return 'User not authorized to edit post'

        } else if(post.comments && !post.title && !post.body) {
            newComments.userId = user.id
            newComments.email = user.email
            newComments.comment = post.comments
            post.comments = newComments
            return await addComments(existsPost.id, post.comments)
        }
    }

}

async function addComments(id, comments) {
    let result = await postDatabase.updateOne({ id: id }, { $push: { comments: comments } })
    return result.modifiedCount === 1
}

async function checkUserAccess(currentUser, authorizedUser) {
    let requestedEditUser = await getUserDetails({ email: currentUser.email })
    if (requestedEditUser._id == authorizedUser.userId) return true
    else return false

}

module.exports = {
    createPost,
    getLatestPostNumber,
    getAllPosts,
    existsPostWithId,
    updatePost
}

