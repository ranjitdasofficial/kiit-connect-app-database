const mongoose = require("mongoose");
const { Schema } = mongoose;



const followersSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  followers:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Users",
      required:true,
    }
  ],

  following:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Users",
      required:true,
    }
  ],
 
});

mongoose.models = {};

const FollowersModel = mongoose.model("Followers", followersSchema);


module.exports = FollowersModel;
