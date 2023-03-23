const mongoose = require("mongoose")
require("dotenv").config();
const uri = process.env.URI;

const connectdb=async()=> {
  try {
    // if (mongoose.connection.readyState == 1) {
    //   console.log("Already Connected");
    //   return;
    // }
  await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
  }
};

 module.exports={connectdb}
