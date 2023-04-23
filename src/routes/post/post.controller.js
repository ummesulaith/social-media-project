const { createPost, getLatestPostNumber, getAllPosts, existsPostWithId, updatePost } = require('../../models/post/post.model')
const { getPagination } = require('../../services/query')

async function httpCreatePost(req, res) {
    let requestPostBody = req.body
    if (!requestPostBody.title || !requestPostBody.body) {
        return res.status(400).json({
            error: 'Missing required Post details',
        })
    }
    let id = await getLatestPostNumber()
    let result = await createPost(requestPostBody, req.user, id)
    return res.status(201).json({ result })
}

async function httpGetAllPost(req, res) {
    const { skip, limit } = getPagination(req.query)
    let filter= req.query
    delete filter.skip
    delete filter.limit
    const posts = await getAllPosts(filter,skip, limit)
    return res.status(200).json(posts)
}

async function httpUpdatePost(req, res) {
    let result
    const postId = Number(req.params.id)
    const postBody = req.body
    if (!Object.keys(postBody).length || !postId) {
        return res.status(400).json({
            error: 'Missing required Post details',
        })
    } else {
        let existsPost = await existsPostWithId(postId)
        if (!existsPost) {
            return res.status(404).json({
                error: 'Post not found'
            })
        } else if (Object.values(postBody).includes('') || Object.values(postBody).includes("")) {
            return res.status(400).json({
                error: 'Post should contain comments/title/body '
            })
        } else {
            console.log('testing update')
            const updatePostResult = await updatePost(postBody, req.user, existsPost)
            console.log('testing updatePostResult', updatePostResult)
            if (updatePostResult == true) {
                result = await existsPostWithId(postId)
                return res.status(200).json({ result })
            }else
                return res.status(400).json({ message : updatePostResult })

        }
    }
}



module.exports = {
    httpCreatePost,
    httpGetAllPost,
    httpUpdatePost
}