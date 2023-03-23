const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email:String,
  accessToken:String,
  createdAt:Date,
  profilePic:String,
  verified:Boolean,
  displayName:String,
  password:String,

});
mongoose.models ={};

const Users = mongoose.model("Users",UserSchema);

module.exports = Users;
 