const { Schema, model } = require("mongoose");

const todoSchema = new Schema({
  userId: { type: String, default: null },
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  completed: { type: Boolean,default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = model("todo", todoSchema);