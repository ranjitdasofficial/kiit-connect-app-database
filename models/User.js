const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email:String,
  accessToken:String,
  createdAt:{
    type:Date,
    default: function() {
      return new Date();
    },
  },
  profilePic:String,
  verified:Boolean,
  displayName:String,
  password:String,
  isAdmin:{
    type:Boolean,
    default:false
  }

});
mongoose.models ={};

const Users = mongoose.model("Users",UserSchema);

module.exports = Users;
 