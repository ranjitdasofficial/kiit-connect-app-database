const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  notifications: [
    {
      senderUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },

      type: {
        type: String,
        required: true,
      },

      contentId:{

        type:String,
        required:true
      },
      createdDate: {
        type: Date,
        default: function () {
          return new Date();
        },
      },
    },
  ],
});

mongoose.models = {};

const NotificationModel = mongoose.model("NotificationModel", NotificationSchema);

module.exports = NotificationModel;




// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const UserSchema = new Schema({
//   email:String,
//   accessToken:String,
//   createdAt:{
//     type:Date,
//     default: function() {
//       return new Date();
//     },
//   },
//   profilePic:String,
//   verified:Boolean,
//   displayName:String,
//   password:String,
//   isAdmin:{
//     type:Boolean,
//     default:false
//   }

// });
// mongoose.models ={};

// const Users = mongoose.model("Users",UserSchema);

// module.exports = Users;
 