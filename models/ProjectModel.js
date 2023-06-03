const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectModelSchema = new Schema({
  projectName:String,
  projectDesc:String,
  githubUrl:String,
  liveUrl:String,
  projectImage:String,
  uploadedBy:String,
  email:String,
  likeCount:Number,
  createdDate:String,
  active:Boolean,
  profilePic:String,
  likedEmail: {
    type: Array,

  },

});
mongoose.models ={};

const ProjectModel = mongoose.model("ProjectModel",ProjectModelSchema);

module.exports = ProjectModel;
 