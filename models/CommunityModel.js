const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommunitySchema = new Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  image:{
    type:String,
  },
  message:{
    type:String,
    required:true
  },
  createdDate:{
    type:Date,
    default: function() {
      return new Date();
    },
  }

});
mongoose.models ={};

const CommunityModel = mongoose.model("Community",CommunitySchema);

module.exports = CommunityModel;
