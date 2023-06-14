const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  replyContent: {
    type: String,
    required: true
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },

  createdDate:{
    type:Date,
    default: function() {
      return new Date();
    },
  }
});

const commentSchema = new mongoose.Schema({
  cmntContent: {
    type: String,
    required: true
  },
  postid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  replies: [replySchema]
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  comments: [commentSchema],
  createdDate:{
    type:Date,
    default: function() {
      return new Date();
    },
  }
});

const Reply = mongoose.model('Reply', replySchema);
const Comment = mongoose.model('Comment', commentSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { Reply, Comment, Post };
