const mongoose = require('mongoose');



const DeviceTokenSchema = new mongoose.Schema({
  deviceToken:{
    type:String,
    required:true,
  } , 
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
});

const DeviceToken = mongoose.model('DeviceToken', DeviceTokenSchema);

module.exports =DeviceToken;
