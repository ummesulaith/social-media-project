const postDatabase = require('./post.model.mongo.schema'),
    userDatabase = require('../user/user.model.mongo.schema'),
    DEFAULT_POST_ID = 1

async function createPost(post, user, id) {
    let resultPostData = {}, Newcomments = {}
    let createdby = await getUserDetails({ email: user.email })
    if (post.comments.length > 0) {
        Newcomments.userId = user.id,
            Newcomments.email = user.email,
            Newcomments.comment = post.comments
    }
    const postData = await postDatabase.create({
        userId: user.id,
        id: id,
        createdby: createdby.name,
        title: post.title,
        body: post.body,
        comments: Newcomments
    });
    resultPostData.postId = postData.id
    resultPostData.createdby = postData.createdby
    resultPostData.title = postData.title
    resultPostData.body = postData.body
    resultPostData.comments = postData.comments
    return resultPostData
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
        if (post.comments) {
            newComments.userId = user.id,
                newComments.email = user.email,
                newComments.comment = post.comments
            post.comments = newComments
            console.log('post', post)
            updateResult = await addComments(existsPost.id, post.comments)
            return updateResult.modifiedCount === 1;

        } else {
            return 'User not authorized to edit post'
        }
    }

}

async function addComments(id, comments) {
    let result = await postDatabase.updateOne({ id: id }, { $push: { comments: comments } })
    return result.modifiedCount === 1
}



module.exports = {
    createPost,
    getLatestPostNumber,
    getAllPosts,
    existsPostWithId,
    updatePost
}

