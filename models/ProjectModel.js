const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new mongoose.Schema({
  replyContent: {
    type: String,
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  likedEmail:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Users",
      required:true,
    }
  ],
  createdDate: {
    type: Date,
    default: function() {
      return new Date();
    },
  },
});



const commentSchema = new mongoose.Schema({
  cmntContent: {
    type: String,
    required: true,
  },
  postid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectModel",
    required: true,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  likedEmail:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Users",
      required:true,
    }
  ],
  replies: [replySchema],
  createdDate: {
    type: Date,
    default: function() {
      return new Date();
    },
  },
});

const ProjectModelSchema = new Schema({
  projectName: String,
  projectDesc: String,
  githubUrl: String,
  liveUrl: String,
  projectImage: String,
  // uploadedBy:String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  createdDate: {
    type: Date,
    default: function() {
      return new Date();
    },
  },

  active: {
    type: Boolean,
    default: true,
  },
  // likedEmail: [
  //  LikeSchema
  // ],

  likedEmail:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Users",
      required:true,
    }
  ],

  comments: [commentSchema],
});
mongoose.models = {};

const ProjectModel = mongoose.model("ProjectModel", ProjectModelSchema);
const CommentsModel = mongoose.model("Comments",commentSchema);
const ReplyModel = mongoose.model("Reply",replySchema);


module.exports = {ProjectModel,CommentsModel,ReplyModel};
