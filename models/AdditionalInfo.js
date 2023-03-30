const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email:String,
  batch:String,
  branch:String,
  currentSemester:String,
  yop:String,
  currentYear:String,
  linkedin:String,
  github:String,
  hackerRank:String,
  others:String,

});
mongoose.models ={};

const AdditionalData = mongoose.model("AdditionalData",UserSchema);

module.exports = AdditionalData;
