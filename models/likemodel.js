const mongoose = require("mongoose");
const { Schema } = mongoose;

const likemodelSchema = new Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  postid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectModel",
    required: true,
  },

  comments: {
    type: String,
    required: true,
  },

  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      parentCommentId: {
        type: Schema.Types.ObjectId,
        required: true,
      },

      replymsg: {
        type: String,
        required: true,
      },

      createdAt: {
        type: Date,
        default: new Date().getTime(),
      },
    },
  ],
});
mongoose.models = {};

const likemodel = mongoose.model("likemodel", likemodelSchema);

module.exports = likemodel;
