const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String }
});

module.exports = model("user", userSchema);