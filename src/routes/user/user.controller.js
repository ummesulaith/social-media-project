
const { signup, existUser, validatePassword } = require('../../../models/user/user.model')

async function httpRegisterUser(req, res) {
  const user = req.body;
  if (!user.first_name || !user.last_name || !user.email || !user.password) {
    return res.status(400).json({
      error: 'Missing required user details',
    })
  }
  let isOldUser = await existUser(user.email.toLowerCase())

  if (isOldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  let result = await signup(user)

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

  let isOldUser = await existUser(user.email.toLowerCase())
  console.log('check user', isOldUser)

  if (isOldUser) {
    result = await validatePassword(isOldUser, user.password)
    console.log('result', result)
    if (!result) return res.status(401).json({ message: "Invalid Credentials. Please check email and password" })
    else
      return res.status(200).json({ result })
  }
  else res.status(401).json({ message: "User Does Not Exist. Please Register" });

}

async function httpHomePage(req, res) {
  res.status(200).send("Welcome 🙌 ");
}

module.exports = {
  httpRegisterUser,
  httpLoginUser,
  httpHomePage
}