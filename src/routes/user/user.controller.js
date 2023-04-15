
const { signup,existUser } = require('../../../models/user.model')

async function httpaddNewUser(req,res){
  const user = req.body;
    if(!user.first_name || !user.last_name || !user.email || !user.password){
      return res.status(400).json({
        error:'Missing required user details',
      })
    }
    let isOldUser = await existUser(user.email.toLowerCase())
    console.log('check user', isOldUser)
    if(isOldUser){
      return res.status(409).send("User Already Exist. Please Login");
    }
    
    await signup(user)
    delete user.password
    
    return res.status(201).json(user)
  }
  
 module.exports={
    httpaddNewUser,
}