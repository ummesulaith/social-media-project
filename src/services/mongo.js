const mongoose = require('mongoose')
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open',()=>{
    console.log('MongoDb is ready')
  })
  mongoose.connection.on('error',(err)=>{
    console.log('MongoDb is not ready', err)
  })

  async function mongoConnect (){
   await mongoose.connect(MONGO_URL)
  }
  async function mongoDisconnect(){
    await mongoose.disconnect()
  }
  
  module.exports = {
    mongoConnect,
    mongoDisconnect
}