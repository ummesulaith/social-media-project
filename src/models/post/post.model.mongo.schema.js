const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  userId: { type: String, default: null },
  id: { type: Number, unique: true },
  createdby : {type: String, default: null},
  title: { type: String, required: true },
  body : { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now  },
  comments: [{
    userId: { type: String, default: null },
    email: {type: String, default: null},
    comment: {type: String, default: null},
    updatedAt: { type: Date, default: Date.now }
 } ],

});

module.exports = model("post", postSchema);