
const User = require('../../models/user/user.model')
const { getPagination } = require('../../services/query')

async function httpRegisterUser(req, res) {
  const user = req.body;
  if (!user.name  || !user.email || !user.password) {
    return res.status(400).json({
      error: 'Missing required user details',
    })
  }
  let isOldUser = await User.existUser(user.email.toLowerCase())

  if (isOldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  let result = await User.signup(user)

  return res.status(201).json(result)
}

async function httpLoginUser(req, res) {
  const user = req.body;
  var result
  if (!user.email || !user.password) {
    return res.status(400).json({
      error: 'Missing required fields email and password',
    })
  }

  let isOldUser = await User.existUser(user.email.toLowerCase())

  if (isOldUser) {
    result = await User.validatePassword(isOldUser, user.password)
    if (!result) return res.status(401).json({ message: "Invalid Credentials. Please check email and password" })
    else
      return res.status(200).json({ result })
  }
  else res.status(401).json({ message: "User Does Not Exist. Please Register" });

}

async function httpHomePage(req, res) {
  res.status(200).send("Welcome 🙌 ");
}

async function httpGetUsers(req,res){
  const { skip, limit } = getPagination(req.query)
  const todos = await User.getAllUsers(skip, limit)
  return res.status(200).json(todos)
}
module.exports = {
  httpRegisterUser,
  httpLoginUser,
  httpHomePage,
  httpGetUsers
}