const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
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
