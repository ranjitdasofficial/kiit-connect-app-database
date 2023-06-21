const express = require("express");
const { connectdb } = require("./db/db");
const AdditionalData = require("./models/AdditionalInfo");
const cors = require("cors");

const multer = require("multer");
const fs = require("fs");

const Users = require("./models/User");
const app = express();




const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where uploaded files will be stored
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Specify a unique name for the uploaded file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create the Multer upload instance
const upload = multer({ storage: storage });

const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");

const key = require("./cred.json");
const { ProjectModel } = require("./models/ProjectModel");
const likemodel = require("./models/likemodel");
const { Post, Comment } = require("./models/CommentsModel");
const { default: mongoose } = require("mongoose");
const SendPushNoti = require("./lib/SendPushNoti");
const sendMessagec = require("./lib/SendPushNoti");
const DeviceToken = require("./models/DeviceToken");
const FollowersModel = require("./models/FollowersModel");

const CommunityModel = require("./models/CommunityModel");
const NotificationModel = require("./models/NotificationModal");
const { file } = require("googleapis/build/src/apis/file");

const auth = new google.auth.GoogleAuth({
  keyFile: key,
  scopes: "https://www.googleapis.com/auth/drive",
});

var drive = google.drive({
  version: "v3",
  auth: auth,
});

var jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/drive"],
  null
);

jwToken.authorize((authErr, token) => {
  if (authErr) {


    console.log("error : " + authErr);
    
    return;
  } else {
    console.log("Authorization accorded");
  }
});

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
// const PORT =  5000;

app.get("/", (req, res) => {
  res.status(200).json({ connection: true });
});

const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

let counter = 0;
app.get("/data", async (req, res) => {
  const data = [
    {
      id: "1",
      firstName: "Tomw",
      lastName: "Cruise",
      photo: "https://jsonformatter.org/img/tom-cruise.jpg",
    },
    {
      id: "2",
      firstName: "Maria",
      lastName: "Sharapova",
      photo: "https://jsonformatter.org/img/Maria-Sharapova.jpg",
    },
    {
      id: "3",
      firstName: "Robert",
      lastName: "Downey Jr.",
      photo: "https://jsonformatter.org/img/Robert-Downey-Jr.jpg",
    },
  ];

  await delay(3000);
  counter++;
  console.log(counter);
  return res.json(data);
});

app.get("/data2", async (req, res) => {
  const data = [
    {
      id: "1",
      firstName: "Ram",
      lastName: "Cruise",
      photo: "https://jsonformatter.org/img/tom-cruise.jpg",
    },
    {
      id: "2",
      firstName: "Maria",
      lastName: "Sharapova",
      photo: "https://jsonformatter.org/img/Maria-Sharapova.jpg",
    },
    {
      id: "3",
      firstName: "Robert",
      lastName: "Downey Jr.",
      photo: "https://jsonformatter.org/img/Robert-Downey-Jr.jpg",
    },
  ];

  await delay(3000);
  counter++;
  console.log(counter);
  return res.json(data);
});

const nodemailer = require("nodemailer");

// Create a transport object
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mail.server.hib@gmail.com",
    pass: "wbrknqwssdophyyd",
  },
});

// AUTH_EMAIL = mail.server.hib@gmail.com
// AUTH_PASSWORD = wbrknqwssdophyyd

// Set options for the message

// Send the email

app.post("/report",upload.single("file"), async (req, res) => {

try {
 if(req.file!=null){
  var fileMetadata = {
    name: req.file.originalname,

    parents: ["1dqvUovRlXlVRQaSohe2DVu7ZVIT5Minc"],
  };
  //   C:\Users\KIIT01\OneDrive\Desktop\KIIT_Project\test\kiit_university_app\pages\api\drive\video.mp4
  var media = {
    mimeType: req.file.mimetype,
    body: fs.createReadStream(path.join(__dirname, req.file.path)),
  };
  drive.files.create(
    {
      auth: jwToken,
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
   async function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
        fs.unlink(path.join(__dirname, req.file.path), (err) => {
          if (err) {
            console.log("Error Deleting file");
          } else {
            console.log("Deleted Sucessfully");
          }
        });
        return res.status(500).json({ message: "Your response has been recorded", success: false  });
      }


      fs.unlink(path.join(__dirname, req.file.path), (err) => {
        if (err) {
          console.log("Error Deleting file");
        } else {
          console.log("Deleted Sucessfully");
        }
      });

      

      var rp = await sendMail(
        req.body.message,
        req.body.senderEmail,
        req.body.senderName,
        req.file.originalname,
        file.data.id
      );
      res.json(rp);


    });

 }else{

  var rp = await sendMailWithoutAttachment(
    req.body.message,
    req.body.senderEmail,
    req.body.senderName,
  );
  res.json(rp);

 }

} catch (error) {
  return res.status(500).json({ message: "Your response has been recorded", success: false  });
}

});

const sendMail = (message, senderEmail, senderName,filename,url) =>
  new Promise((resolve, reject) => {
    let mailOptions = {
      from: '"KIIT CONNECT"<no-reply@kiitconnect.live>',
      to: "technicalranjit@gmail.com",
      subject: `Feedback/Report from : ${senderName} : ${senderEmail} `,
      text: `${message}`,
      attachments: [
        {
          filename: filename,  // Set the appropriate filename and extension
          path: `https://drive.google.com/uc?export=download&id=${url}`,  
        }
      ]
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject({ message: "Error Occured", success: false });
      } else {
        // console.log('Email sent: ' + info.response);
        resolve({ message: "Your response has been recorded", success: true });
      }
    });
  });
const sendMailWithoutAttachment = (message, senderEmail, senderName) =>
  new Promise((resolve, reject) => {
    let mailOptions = {
      from: '"KIIT CONNECT"<no-reply@kiitconnect.live>',
      to: "technicalranjit@gmail.com",
      subject: `Feedback/Report from : ${senderName} : ${senderEmail} `,
      text: `${message}`,
     
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject({ message: "Error Occured", success: false });
      } else {
        // console.log('Email sent: ' + info.response);
        resolve({ message: "Your response has been recorded", success: true });
      }
    });
  });

app.post("/api/auth/getAditionalInfo", async (req, res) => {
    await connectdb();
    const user = await AdditionalData.findOne({userid : req.body.userid });
    if (!user) {
      return res.status(404).json({err:"User doesnot exist"})
    }
      return res.status(200).json(user);
});





app.post("/test", async (req, res) => {
  console.log(req.body.email);
  res.json({ success: false });
});

app.post("/api/auth/UpdateAdditional", async (req, res) => {
  console.log(req.body.batch, req.body.branch, req.body.email);

    await connectdb();
    const checkDataExist = await AdditionalData.findOne({
      userid: req.body.userid,
    });
    const batch = req.body.batch;
    const branch = req.body.branch;
    const currentSemester = req.body.currentSemester;
    const currentYear = req.body.currentYear;
    const github = req.body.github;
    const hackerRank = req.body.hackerRank;
    const linkedin = req.body.linkedin;
    const others = req.body.others;
    const yop = req.body.yop;



    if(!checkDataExist){
      AdditionalData.create({
        userid:req.body.userid,
        batch: batch ?? "Set",
        branch: branch ?? "Set",
        currentSemester: currentSemester ?? "Set",
        currentYear: currentYear ?? "Set",
        github: github ?? "Set",
        hackerRank: hackerRank ?? "Set",
        linkedin: linkedin ?? "Set",
        others: others ?? "Set",
        yop: yop ?? "Set",
      }) .then((data) => {
        console.log(data);
        return res.status(200).json({data:data,new:true});
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).json({err:err});
      });
    }else{


      const up = await AdditionalData.updateOne(
        { userid: req.body.userid },
        {
          $set: {
            batch: batch,
            branch: branch,
            currentSemester: currentSemester,
            currentYear: currentYear,
            github: github,
            hackerRank: hackerRank,
            linkedin: linkedin,
            others: others,
            yop: yop,
          },
        }
      );
      const updatedData = await AdditionalData.findOne({ userid: req.body.userid });
      if (up.modifiedCount > 0) {
        return res.status(200).json({
          modified:true,
          new:false,
          updatedData:updatedData
          
        });
      } else {
        
        return res.status(200).json({
          err: "Not modified",
          modified:false,
          new:false,
          updatedData:updatedData
        });
      }
  

    }

   

});


app.post("/getallusers",async(req,res)=>{
  try {
    await connectdb();
    Users.find({}).then((data)=>{
      return res.json(data);
    }).catch((err)=>res.json(err));
  } catch (error) {
    console.log(error);
  }
})

app.post("/getSuggestion", async (req, res) => {

  try {

    await connectdb();
    const pageNo = req.body.pageNo;
    const limit = 10;
    const usersFollow = await FollowersModel.findOne({userid:req.body.currentUserId}).select("following -_id");
    
    const followingUsers = usersFollow.following;

    // console.log(followingList);

    // res.json(followingList);

 Users.find({ _id: { $nin: followingUsers } }).skip(pageNo*limit).limit(limit).select("_id displayName profilePic").then(async(d)=>{
  const promises = d.map((user) => {
    return new Promise((resolve, reject) => {
      const obj = {
        userid: user,
        isFollowing: false
      };
      resolve(obj);
    });
  });
  
  Promise.all(promises)
    .then((results) => {
      console.log(results);

     return res.status(200).json({length:d.length, data:results});
      // Do something with the results
    })
    .catch((error) => {
      console.error(error);
      // Handle the error

      return res.status(500).json({err:error});
    });
  

 }).catch((err)=>res.status(500).json({err:err}));




  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error, data: null });
  }
});





app.post("/getfollowers",async(req,res)=>{
 try {
  await connectdb();
  const whomtosearch = req.body.whomtosearch;
  const currentUserId = req.body.currentUserId;
  const offset = req.body.offset || 0;
const limit = 10;



  const followerUser = await FollowersModel.findOne({userid:whomtosearch}).populate('followers');



  const followerList = followerUser.followers.slice(offset,offset+limit);


 const p = await new Promise(async (resolve, reject) => {
  try {
    const allfollowers = await Promise.all(followerList.map(async (user) => {
      
      const eachFollowerList = await FollowersModel.findOne({ userid: user.id }).select("followers").exec();

      const isFollowing = eachFollowerList.followers.includes(currentUserId);
      
      return {
        
        isFollowing: isFollowing,
        userid:{
          displayName:user.displayName,
          _id:user._id,
          profilePic:user.profilePic
        }

      };
    }));
  
    resolve(allfollowers);
  } catch (error) {
    reject(error);
  }
});




  return res.status(200).json({id:followerUser._id, length:followerUser.followers.length,data:p});
 } catch (error) {
  console.log(error);
  return res.status(500).json({err:error});
 }


})




app.post("/searchUser", async (req, res) => {

  try {

    await connectdb();
    const event = req.body.event;
    // const whomToSearch=req.body.whomToSearch;
    const currentUserId = req.body.currentUserId;
    const pageNo = req.body.pageNo;




//followers

const whomtosearch = req.body.whomToSearch;



//following



console.log(event);







if(event=="suggestion"){


  const usersFollow = await FollowersModel.findOne({userid:req.body.currentUserId}).select("following -_id");
    
  const followingUsers = usersFollow.following;

Users.find({ _id: { $nin: followingUsers },   displayName: { $regex: new RegExp(req.body.query, 'i') }  }).select("_id displayName profilePic").then(async(d)=>{
const promises = d.map((user) => {
  return new Promise((resolve, reject) => {
    const obj = {

      userid: user,
      isFollowing: false
    };
    resolve(obj);
  });
});

Promise.all(promises)
  .then((results) => {
    console.log(results);

    return res.status(200).json({length:d.length, data:results});
    // Do something with the results
  })
  .catch((error) => {
    console.error(error);
    // Handle the error
    console.log(error);

    return res.status(500).json({err:err})
  });


}).catch((err)=>res.status(500).json({err:err}));



}else if(event=="follower"){

  const followerUser = await FollowersModel.findOne({userid:whomtosearch}).populate('followers');
  const followerList = followerUser.followers;

  const foundUser = followerList.filter((user) =>
  user.displayName.toLowerCase().startsWith(req.body.query.toLowerCase())


);


// res.json(foundUser);
 const p = await new Promise(async (resolve, reject) => {
  try {
    const allfollowers = await Promise.all(foundUser.map(async (user) => {

      
      const eachFollowerList = await FollowersModel.findOne({ userid: user.id }).select("followers").exec();

      const isFollowing = eachFollowerList.followers.includes(currentUserId);
      
      return {
        
        isFollowing: isFollowing,
        userid:{
          displayName:user.displayName,
          _id:user._id,
          profilePic:user.profilePic
        }

      };
    }));
  
    resolve(allfollowers);
  } catch (error) {
    reject(error);
  }
});
 return res.status(200).json({id:followerUser._id,length:followerUser.followers.length,data:p});
}else{

  const followerUser = await FollowersModel.findOne({userid:whomtosearch}).populate('following');

  const followerList = followerUser.following;

  const foundUser = followerList.filter((user) =>
  user.displayName.toLowerCase().startsWith(req.body.query.toLowerCase()));

 const p = await new Promise(async (resolve, reject) => {
  try {
    const allfollowers = await Promise.all(foundUser.map(async (user) => {
      
      const eachFollowerList = await FollowersModel.findOne({ userid: user.id }).select("followers").exec();

      const isFollowing = eachFollowerList.followers.includes(currentUserId);
      
      return {
        isFollowing: isFollowing,
        userid:{
          displayName:user.displayName,
          _id:user._id,
          profilePic:user.profilePic
        }
      };
    }));
  
    resolve(allfollowers);
  } catch (error) {
    reject(error);
  }
});
  return res.status(200).json({id:followerUser._id,length:followerUser.following.length,data:p});
}
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error, data: null });
  }
});



app.post("/getAllUsersAddtional", async (req, res) => {
  try {
    await connectdb();
    const users = await AdditionalData.find({});
    if (!users) {
      return res.json({
        success: false,
        message: "Cannot Reach to Server",
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Data Fetched Sucessfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Error", data: null });
  }
});

app.post("/api/auth/UploadAdditionalInfo", async (req, res) => {

   try {
    await connectdb();
    console.log(req.body.userid,"called secodnd");

    const checkDataExist = await AdditionalData.findOne({
      userid: req.body.userid,
    });


    if(checkDataExist){
      return res.status(409).json({err:"Data Already Exist"})
    }


      const batch = req.body.batch;
      const branch = req.body.branch;
      const currentSemester = req.body.currentSemester;
      const currentYear = req.body.currentYear;
      const github = req.body.github??null;
      const hackerRank = req.body.hackerRank??null;
      const linkedin = req.body.linkedin??null;
      const others = req.body.others??null;
      const yop = req.body.yop;

      AdditionalData.create({
        userid:req.body.userid,
        batch: batch ?? "Set",
        branch: branch ?? "Set",
        currentSemester: currentSemester ?? "Set",
        currentYear: currentYear ?? "Set",
        github: github ?? "Set",
        hackerRank: hackerRank ?? "Set",
        linkedin: linkedin ?? "Set",
        others: others ?? "Set",
        yop: yop ?? "Set",
      })
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((err) => {
          console.log(err)
         
          return res.status(500).json({err:err});
        });
   } catch (error) {
    
    return res.status(500).json({err:error});
   }
    
});

app.post("/api/auth/signup", async (req, res) => {
  await connectdb();
  // const email = req.body.email;
  // console.log(email);
  const user = await Users.findOne({ email: req.body.email }).select("-password");
  const accessToken = req.body.authToken ? req.body.authToken : "invalid";
  const isAppuser = true;
  const displayName = req.body.displayName;
  const profilepic = req.body.profilePic;
  const deviceToken = req.body.deviceToken;

  if (!user) {
    Users.create({
      email: req.body.email,
      verified: true,
      accessToken: accessToken,
      displayName: displayName,
      profilePic: profilepic,
      createdAt: Date.now(),
      password: null,
      isAppuser: isAppuser,

    
    })
      .then(async (users) => {
        await FollowersModel.create({
          userid:users._id,
          followers:[],
          following:[]
        })
   
        if(deviceToken){
          await DeviceToken.create({
            userid:users._id,
            deviceToken:deviceToken
          })
        }

        await NotificationModel.create({
          userid:users._id,
          notifications:[]
        });
        
        return res.status(200).json({newuser:true,user:users,follow:{followers:0,following:0},projectCount:0})
      })
      .catch((err) => {
        return res.status(500).json({err:err});
      });
  }
   else {


    const checkDeviceToken = await DeviceToken.findOne({
      userid: user._id,
    });

    if (!checkDeviceToken && deviceToken != null) {
     await DeviceToken.create({
        userid: user._id,
        deviceToken: deviceToken,
      })
    }else{
      if(deviceToken!=null){
     
        await DeviceToken.findOneAndUpdate(
           {
             userid: user.id,
           },
           { $set: { deviceToken: deviceToken } }
         )
     
      }
    }




const follow = await FollowersModel.findOne({userid:user._id});
const projectCount = await ProjectModel.find({uploadedBy:user._id});

return res.status(200).json({newuser:false,user:user,follow:{followers:follow.followers.length,following:follow.following.length},projectCount:projectCount.length})

//       }
   }
// res.json("Already exist");



    }
  
);

//uploading images to google drive

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    await connectdb();




    // console.log(deviceToken);

    if (req.file != null) {
      var fileMetadata = {
        name: req.file.originalname,

        parents: ["1dqvUovRlXlVRQaSohe2DVu7ZVIT5Minc"],
      };
      //   C:\Users\KIIT01\OneDrive\Desktop\KIIT_Project\test\kiit_university_app\pages\api\drive\video.mp4
      var media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(path.join(__dirname, req.file.path)),
      };
      drive.files.create(
        {
          auth: jwToken,
          resource: fileMetadata,
          media: media,
          fields: "id",
        },
        function (err, file) {
          if (err) {
            // Handle error
            console.error(err);
            fs.unlink(path.join(__dirname, req.file.path), (err) => {
              if (err) {
                console.log("Error Deleting file");
              } else {
                console.log("Deleted Sucessfully");
              }
            });
            return res.json({ success: false, message: "Error " });
          } else {
            console.log(file.data.id);
            ProjectModel.create({
              projectName: req.body.projectName,
              projectDesc: req.body.projectDesc,
              githubUrl: req.body.githubUrl,
              liveUrl: req.body.liveUrl,
              projectImage: file.data.id,
              uploadedBy: req.body.uploadedBy,
              likedEmail: [],
              comments: [],
            })
              .then(async(d) => {
                console.log(d);
                fs.unlink(path.join(__dirname, req.file.path), (err) => {
                  if (err) {
                    console.log("Error Deleting file");
                    return;
                  }
                  console.log("Deleted Sucessfully");
                });

                console.log(`${d._id}`);
                console.log(d._id.toString());
                await d.populate("uploadedBy", "displayName email profilePic _id");

              


                  const user = await Users.findById(req.body.uploadedBy).select("displayName");
                  const deviceTokens = await DeviceToken.find({ deviceToken: { $ne: req.body.deviceToken } }).select("deviceToken -_id userid");


          const userIds = deviceTokens.map(deviceToken => deviceToken.userid.toString());
          const deviceTokenList = deviceTokens.map(deviceToken => deviceToken.deviceToken);



  
                  const message = {
                    data:{
                      event:"upload",
                      data:`${d._id==null?"Null id":d._id.toString()}`
                    },
                    image:`https://drive.google.com/uc?export=download&id=${file.data.id}`,
                    body: `${user.displayName} has uploaded a project (${req.body.projectName})`
                    // "sound"
                  }
                  
  
                   sendMessagec(deviceTokenList,message);


                   await NotificationModel.updateMany(
                    { userid: { $in: userIds } },
                    { $push: { notifications: { senderUserId:req.body.uploadedBy,type:"upload",contentId:d._id } } }
                  );


                



                
                
                 
                // sendMessagec("")
                return res.json({
                  success: true,
                  message: "File has been created ",
                  project:d
                });
              })
              .catch((err) => {
                fs.unlink(path.join(__dirname, req.file.path), (err) => {
                  if (err) {
                    console.log("Error Deleting file");
                    return;
                  }
                  console.log("Deleted Sucessfully");
                });

               
                return res.json({
                  success: false,
                  message: "Error Something went wrong!",
                });
              });
          }
        }
      );
    } else {
      ProjectModel.create({
        projectName: req.body.projectName,
        projectDesc: req.body.projectDesc,
        githubUrl: req.body.githubUrl,
        liveUrl: req.body.liveUrl,
        projectImage: null,
        uploadedBy: req.body.uploadedBy,
        likedEmail: [],
        comments: [],
      })
        .then(async(d) => {


      
          await d.populate("uploadedBy", "displayName email profilePic _id");
          const deviceTokens = await DeviceToken.find({ deviceToken: { $ne: req.body.deviceToken } }).select("deviceToken -_id userid");


          const userIds = deviceTokens.map(deviceToken => deviceToken.userid.toString());
          const deviceTokenList = deviceTokens.map(deviceToken => deviceToken.deviceToken);

          const message = {
            data:{
              event:"upload",
    
              data:`${d._id==null?"Null id":d._id.toString()}`,
            },
            image:``,
            body: `${d.uploadedBy.displayName} has uploaded a project (${req.body.projectName})`
            // "sound"
          }
          

           sendMessagec(deviceTokenList,message);

         
         
           // res.json({userIds,deviceTokenList});
       
       
           await NotificationModel.updateMany(
             { userid: { $in: userIds } },
             { $push: { notifications: { senderUserId:req.body.uploadedBy,type:"upload",contentId:d._id } } }
           )

          return res.json({ success: true, message: "File has been created ", project:d});
        })
        .catch((err) => {
          console.log(err);
          res.json({ success: false, message: "Error Something went wrong!" });
        });
    }
  } catch (error) {
    console.log(error);

    return res.json({ success: false, message: "Error Something went wrong!" });
    // console.log(error);
  }
});





app.post("/testnoti",async(req,res)=>{

  try {
    await connectdb();
    // const deviceTokens = await DeviceToken.find({ deviceToken: { $ne: req.body.deviceToken } }).select("deviceToken -_id userid");


    // const userIds = deviceTokens.map(deviceToken => deviceToken.userid.toString());
    // const deviceTokenList = deviceTokens.map(deviceToken => deviceToken.deviceToken);
  
  
    // // res.json({userIds,deviceTokenList});


    // await NotificationModel.updateMany(
    //   { userid: { $in: userIds } },
    //   { $push: { notifications: { senderUserId:"6489edd2649838fdeda4c74e",type:"like", } } }
    // ).then((r)=>{
    //   res.json(r);
    // })






    // await connectdb();

    const users = await Users.find();

    let allModelsCreated = true; // Variable to track creation status

    for (const user of users) {
      const existingNotification = await NotificationModel.findOne({ userid: user._id });

      if (!existingNotification) {
        const notification = new NotificationModel({
          userid: user._id,
          notifications: []
        });

        await notification.save();
      }
    }

    if (allModelsCreated) {
      res.json({ message: "All notification models created successfully." });
    } else {
      res.json({ message: "Some notification models already exist." });
    }


  } catch (error) {
    console.log(error)
  }


})


app.post("/notificationClickFetch",async(req,res)=>{
  await connectdb();

  ProjectModel.findById(req.body.postid).select("-comments").populate("uploadedBy","email displayName profilePic _id").exec().then((project)=>{
    const likedCount = project.likedEmail.length;
    const isLiked = project.likedEmail.includes(req.body.currentUserId);
    const post={
      isLiked: isLiked,
      likedCount:likedCount,
      projectDetails:{
        "_id": project._id,
        "projectName": project.projectName,
        "projectDesc":project.projectDesc,
        "githubUrl": project.githubUrl,
        "liveUrl": project.liveUrl,
        "projectImage": project.projectImage,
        "uploadedBy": project.uploadedBy,
        "active": project.active,
        "createdDate": project.createdDate,
      }
    }

    return res.status(200).json({post:post});
  }).catch((err)=>{
    return res.status(500).json({err:err});
  })
})

app.post("/like", async (req, res) => {
  await connectdb();
  // console.log(req.body.likedEmail);

  const post = await ProjectModel.findById(req.body.postid);
  if(!post){
    return res.status(404).json({err:"postid not found"});
  }
    const likedIndex = post.likedEmail.findIndex((val) => val == req.body.userid);

  

    const deviceToken = await DeviceToken.findOne({userid:post.uploadedBy._id}).select("deviceToken -_id");
    const user = await Users.findById(req.body.userid).select("displayName -_id");


  console.log(likedIndex);

  if (likedIndex != -1) {
   
    post.likedEmail.splice(likedIndex, 1);
    // console.log("yes");
  } else {


      if(req.body.userid!=post.uploadedBy._id){


        await NotificationModel.updateOne(
          { userid: post.uploadedBy._id },
          { $push: { notifications: { senderUserId:req.body.userid,type:"like",contentId:post._id } } }
        );

        const message = {
          data:{
            event:"like",
            
            data:`${req.body.postid}`,
          },
          image:`https://drive.google.com/uc?export=download&id=${post.projectImage}`,
          body:`${user.displayName} has liked your project`
    
    
    
        }
    
        
        sendMessagec([`${deviceToken.deviceToken}`],message);
    }
    post.likedEmail.push(req.body.userid);
    console.log("No");
  }

  return post
    .save()
    .then((r) => res.json(r))
    .catch((err) => res.json(err));
});

app.post("/commentLike", async (req, res) => {
try {
  await connectdb();
  // console.log(req.body.likedEmail);

  console.log(req.body.postid);

  const post = await ProjectModel.findById(req.body.postid);

  if (!post) {
    return res.json({ success: false, err: "post not found" });
  }

 


  const cmntidx = post.comments.findIndex((c) => c._id == req.body.commentId);

  if (cmntidx == -1) {
    return res.json({ success: false, err: "Comment not found" });
  }

  const likeidx = post.comments[cmntidx].likedEmail.findIndex(
    (lk) => lk == req.body.userid
  );

  if (likeidx == -1) {
    post.comments[cmntidx].likedEmail.push(req.body.userid);
      if(req.body.userid!=post.comments[cmntidx].userid){

        const deviceToken = await DeviceToken.findOne({userid:post.comments[cmntidx].userid}).select("deviceToken -_id");
        const user = await Users.findById(req.body.userid).select("displayName -_id");
      
        await NotificationModel.updateOne(
          { userid: post.comments[cmntidx].userid },
          { $push: { notifications: { senderUserId:req.body.userid,type:"commentLike",contentId:post._id } } }
        );
        const message = {
          data:{
            event:"commentLike",
           
            data:`${req.body.postid}`,
          },
          image:`https://drive.google.com/uc?export=download&id=${post.projectImage}`,
          body:`${user.displayName} has liked your comment`
    
        }
        
        sendMessagec([`${deviceToken.deviceToken}`],message);
    }
  } else {
    post.comments[cmntidx].likedEmail.splice(likeidx, 1);
  }

  // post.likedEmail.push(req.body.userid);

  // post.save().then((r)=>res.json(r)).catch((err)=>res.json(err));
  // const likedIndex = post.likedEmail.findIndex(
  //   (val) =>val==req.body.userid
  // );

  return post
    .save()
    .then((r) => res.json(r))
    .catch((err) => res.json(err));
} catch (error) {
  console.log(error);
}
});

app.post("/repliesLike", async (req, res) => {
  await connectdb();
  // console.log(req.body.likedEmail);

  const post = await ProjectModel.findById(req.body.postid);

  if (!post) {
    return res.json({ success: false, err: "post not found" });
  }
 


  const parentCmntIdx = post.comments.findIndex(
    (c) => c._id == req.body.parentCommentId
  );

  if (parentCmntIdx == -1) {
    return res.json({ success: false, err: "ParentComment not found" });
  }

  const replyidx = post.comments[parentCmntIdx].replies.findIndex(
    (rep) => rep._id == req.body.commentId
  );

  if (replyidx == -1) {
    return res.json({ success: false, err: "Comment not found" });
  }

  const replylikeidx = post.comments[parentCmntIdx].replies[
    replyidx
  ].likedEmail.findIndex((lk) => lk == req.body.userid);

  if (replylikeidx == -1) {

    if(req.body.userid!=post.comments[parentCmntIdx].replies[replyidx].userid){
      const deviceToken = await DeviceToken.findOne({userid:post.comments[parentCmntIdx].replies[replyidx].userid}).select("deviceToken -_id");
      const user = await Users.findById(req.body.userid).select("displayName -_id");
      await NotificationModel.updateOne(
        { userid: post.comments[parentCmntIdx].replies[replyidx].userid },
        { $push: { notifications: { senderUserId:req.body.userid,type:"replyLike",contentId:post._id } } }
      );
      const message = {
        data:{
          event:"replyLike",
       
          data:`${req.body.postid}`,
        },
        image:`https://drive.google.com/uc?export=download&id=${post.projectImage}`,
        body:`${user.displayName} has liked your reply`
  
      }
  
      
      sendMessagec([`${deviceToken.deviceToken}`],message);
    }
    post.comments[parentCmntIdx].replies[replyidx].likedEmail.push(
      req.body.userid
    );

    
  } else {
    post.comments[parentCmntIdx].replies[replyidx].likedEmail.splice(
      replylikeidx,
      1
    );
  }

  // post.likedEmail.push(req.body.userid);

  // post.save().then((r)=>res.json(r)).catch((err)=>res.json(err));
  // const likedIndex = post.likedEmail.findIndex(
  //   (val) =>val==req.body.userid
  // );

  return post
    .save()
    .then((r) => res.json(r))
    .catch((err) => res.json(err));
});

app.post("/fetchlikes", async (req, res) => {
  await connectdb();
  ProjectModel.findById(req.body.postid)
    .select("likedEmail")
    .populate({
      path: "likedEmail",
      populate: {
        path: "userid",

        select: "email displayName profilePic",
      },
    })
    .exec()
    .then((l) => res.json(l))
    .catch((err) => res.json(err));
});

app.get("/rand", async (req, res) => {
  await connectdb();

  ProjectModel.find({ active: true })
    .then((data) => {
      for (let i = data.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        let temp = data[i];
        data[i] = data[j];
        data[j] = temp;
      }

      res.json(data);
    })
    .catch((err) => console.log(err));
});

app.get("/getfiles", async (req, res) => {
  fs.readdir(path.join(__dirname, "uploads/"), (err, files) => {
    if (err) {
      return res.json({ err: err });
    }
    return res.json({ files: files });
  });
});

// ser": {
//   "_id": "646cabea6d80338681b4f35d",
//   "email": "teamxgit7@gmail.com",
//   "accessToken": "invalid",
//   "createdAt": "2023-05-23T12:04:58.313Z",
//   "profilePic": null,
//   "verified": true,
//   "displayName": "Teamxgit7",
//   "password": null,
//   "__v": 0

app.post("/getcomments", async (req, res) => {
  await connectdb();

  const limit = 6;

  ProjectModel.findById(req.body.postid).select("comments")
    .populate({
      path: "comments",
      populate: {
        path: "userid",

        select: "email displayName profilePic",
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "replies",
        populate: {
          path: "userid",
          select: "email displayName profilePic",
          // select: 'email displayName'
        },
      },
    })
    .exec()
    .then((c) => {
      const comments = c['comments'].reverse().slice(req.body.offset,req.body.offset+limit);
      res.json({comments:comments,length:c['comments'].length});
    })
    .catch((err) => res.json(err));

  // likemodel.find({postid:req.body.postid}).populate('userid','-password').then((cmnt)=>res.json(cmnt)).catch((err)=>res.json(err));

  // const posts = await ProjectModel.find();

  // const postsWithCommentCount = await Promise.all(posts.map(async (post) => {
  //   const commentCount = await likemodel.countDocuments({ postid: post._id });
  //   return { ...post.toObject(), commentCount };
  // }));
});



app.post("/getPostLikes", async (req, res) => {
  await connectdb();

  const limit = 15;
  const offset = req.body.offset;

  ProjectModel.findById(req.body.postid).select("likedEmail -_id")
    
    .populate({
      path: "likedEmail",
      select:"_id displayName profilePic "
      
    })
    .exec()
    .then((c) => {
      // const comments = c['comments'].reverse().slice(req.body.offset,req.body.offset+limit);
      const likes = c.likedEmail.reverse().slice(offset,offset+limit);
      // res.json({comments:comments,length:c['comments'].length});
      res.json({data:likes,length:c.likedEmail.length});
    })
    .catch((err) => res.json(err));

 
});




app.post("/addpost", async (req, res) => {
  await connectdb();
  const title = req.body.title;
  const userid = req.body.userid;
  // const comments = req.body.comments;
  // const replies = [];

  // const getUser 

  Post.create({
    userid: userid,
    title: title,
    comments: [],
  })
    .then((p) => res.json(p))
    .catch((err) => res.json(err));
});

app.post("/replies", async (req, res) => {
  await connectdb();

  // const post = await ProjectModel.findById(req.body.postid);
  // post.comments.map((c)=>c._id==req.body.commentId);

  const postId = req.body.postid; // Replace with your post ID
  const commentId = req.body.commentId; // Replace with your comment ID

  const reply = {
    replyContent: req.body.replyContent,
    userid: req.body.userid, // Replace with the user ID of the reply creator
  };

  ProjectModel.findOneAndUpdate(
    { _id: postId, "comments._id": commentId },
    { $push: { "comments.$.replies": reply } },
    { new: true }
  ).populate({
    path: 'comments.replies',
    populate: {
      path: 'userid', // Replace with the appropriate user model name
    },
  })
  .exec()
    .then(async(updatedPost) => {
      // console.log('Post with updated comment:', updatedPost);
      const p = await ProjectModel.findById(postId);
      const cmntIdx = p.comments.findIndex((val)=>val._id==commentId);
      const authoruid =  p.comments[cmntIdx].userid;
      const deviceToken = await DeviceToken.findOne({userid:authoruid}).select("deviceToken -_id");
      const likedBy = await Users.findById(req.body.userid).select("displayName -_id");
     
      if(p.comments[cmntIdx].userid!=req.body.userid){
        await NotificationModel.updateOne(
          { userid: p.comments[cmntIdx].userid },
          { $push: { notifications: { senderUserId:req.body.userid,type:"addreply",contentId:postId } } }
        );
        const message = {
          data:{
            event:"addReply",
        
            data:`${req.body.postid}`,
          },
          image:`https://drive.google.com/uc?export=download&id=${p.projectImage}`,
          body:`${likedBy.displayName} has reply your comment`
      
        }
      
        
        sendMessagec([`${deviceToken.deviceToken}`],message);
      }




      const cidx =  updatedPost.comments.findIndex((val)=>val._id==commentId);

        const repid = updatedPost.comments[cidx].replies[updatedPost.comments[cidx].replies.length-1];
        return res.json({ 
          success: true, reply:repid });
      
      
    })
    .catch((error) => {
      // print(err);

    
      return res.json({ success: false,error:error});
    });
});

app.post("/deleteComment", async (req, res) => {
  await connectdb();


  const post = await ProjectModel.findById(req.body.postid);

  console.log(req.body.postid,req.body.parentCommentId,req.body.commentId,req.body.userid);
  if (req.body.event == 0) {
    const idx = post.comments.findIndex(
      (val) => val.userid == req.body.userid && val._id == req.body.parentCommentId
    );

    if (idx != -1) {
      post.comments.splice(idx, 1);
    } else {
      return res.status(404).json({err: "Id not found" });
    }



  }
  
  
  else {
    const idx = post.comments.findIndex(
      (val) =>
         val._id == req.body.parentCommentId
    );

    if (idx == -1) {
      return res.status(404).json({  err: "Parent Id not found" });
    }

    const l = post.comments[idx].replies.findIndex(
      (rp) => rp._id == req.body.commentId && rp.userid == req.body.userid
    );

    // return res.json(l);

    if (l != -1) {
      post.comments[idx].replies.splice(l, 1);
    } else {
      return res.status(404).json({  err: "Id not found" });
    }

    // if(idx!=-1){

    //   post.comments.splice(idx,1);

    // }
    // else{
    //   return res.json({success:false,err:"Id not found"});
    // }
  }
  post
    .save()
    .then((p) => {
      return res.status(200).json({ sucess: true });
    })
    .catch((err) => res.status(500).json({  err: err }));
  // return res.json({success:false,err:"Id not found"});
});

app.post("/getMyPost", async (req, res) => {
 try {
  console.log("running");
  await connectdb();

  const pageNo = req.body.pageNo;
  const projectPerPage = 5;
  const totalDocument = await ProjectModel.countDocuments();
  await ProjectModel.find({uploadedBy:req.body.currentUserId}).select("-comments").sort({ createdDate: -1 }).skip(pageNo*projectPerPage).limit(projectPerPage)


    .populate("uploadedBy", "email displayName profilePic _id")

    .then(async(p) => {
      // return res.json({length:p.length,project:p});
          const allp = await Promise.all(p.map(async (project) => {

            const length = project.likedEmail.length;
            const isLiked = project.likedEmail.includes(req.body.currentUserId);
            
            return {
              
              isLiked: isLiked,
              likedCount:length,
              projectDetails:{
                "_id": project._id,
                "projectName": project.projectName,
                "projectDesc":project.projectDesc,
                "githubUrl": project.githubUrl,
                "liveUrl": project.liveUrl,
                "projectImage": project.projectImage,
                "uploadedBy": project.uploadedBy,
                "active": project.active,
                "createdDate": project.createdDate,
              }
      
            };
          }));

      return res.status(200).json({data:allp,length:totalDocument});
      // return res.json({length:totalDocument,result:result});
    })
    .catch((err) => res.status(500).json(err));
 } catch (error) {
  console.log(error)
  res.status(500).json(error);
 }
});







app.post("/getpost", async (req, res) => {
  try {
   console.log("running");
   await connectdb();
 
   const pageNo = req.body.pageNo;
   const projectPerPage = 5;
   const totalDocument = await ProjectModel.countDocuments();
   await ProjectModel.find().select("-comments").sort({ createdDate: -1 }).skip(pageNo*projectPerPage).limit(projectPerPage)
 
 
     .populate("uploadedBy", "email displayName profilePic _id")
 
     .then(async(p) => {
       // return res.json({length:p.length,project:p});
       for (let i = p.length - 1; i > 0; i--) {
         let j = Math.floor(Math.random() * (i + 1));
 
         let temp = p[i];
         p[i] = p[j];
         p[j] = temp;
       }
       
 
 
 
           const allp = await Promise.all(p.map(async (project) => {
 
             const length = project.likedEmail.length;
             const isLiked = project.likedEmail.includes(req.body.currentUserId);
             
             return {
               
               isLiked: isLiked,
               likedCount:length,
               projectDetails:{
                 "_id": project._id,
                 "projectName": project.projectName,
                 "projectDesc":project.projectDesc,
                 "githubUrl": project.githubUrl,
                 "liveUrl": project.liveUrl,
                 "projectImage": project.projectImage,
                 "uploadedBy": project.uploadedBy,
                 "active": project.active,
                 "createdDate": project.createdDate,
               }
       
             };
           }));
 
         
  
 
             
       
       return res.json({data:allp,length:totalDocument});
       // return res.json({length:totalDocument,result:result});
     })
     .catch((err) => res.json(err));
  } catch (error) {
   console.log(error)
  }
 });

app.post("/addcomment", async (req, res) => {
 try {
  await connectdb();

  // const uploadedBy = req.body.uploadedBy;
  // const email = req.body.email;

  const postid = req.body.postid;
  const userid = req.body.userid;
  const comments = req.body.comments;
  const replies = [];

  var c = new Comment({
    cmntContent: comments,
    postid: postid,
    userid: userid,
    replies: [],
  });

  const p = await ProjectModel.findById(postid);

  const deviceToken = await DeviceToken.findOne({userid:p.uploadedBy._id}).select("deviceToken -_id");
  const user = await Users.findById(req.body.userid).select("displayName -_id");
 
if(req.body.userid!=p.uploadedBy._id){

  await NotificationModel.updateOne(
    { userid: p.uploadedBy._id },
    { $push: { notifications: { senderUserId:req.body.userid,type:"addcomments", contentId:postid} } }
  );
  const message = {
    data:{
      event:"addComment",
   
      data:`${req.body.postid}`,
    },
    image:`https://drive.google.com/uc?export=download&id=${p.projectImage}`,
    body:`${user.displayName} commented on your Project`

  }  
  sendMessagec([`${deviceToken.deviceToken}`],message);

}


  p.comments.push(c);

  p.save()
    .then(async(p) => {
      
      await p.populate("comments.userid");
      res.json({ success: true,comments:p.comments[p.comments.length-1] })})
    .catch((err) => res.json({ success: false, err: err }));
 } catch (error) {
  return res.status(200).json({err:error});
 }
});

app.post("/deleteProject", async (req, res) => {
  try {
    console.log("deleting....");
    await connectdb();

    ProjectModel.findOneAndDelete({
      _id: req.body.postid,
      uploadedBy: req.body.userid,
    })
      .then((val) => {
        console.log(val);
        return res.json({ success: true, message: "Item Deleted Sucessfully" });
      })
      .catch((err) =>
        res.json({ success: false, message: "Something went wrong!!" })
      );
  } catch (error) {
    return res.json({ success: false, message: error });
  }
});

app.get("/allProject", async (req, res) => {
  await connectdb();

  ProjectModel.find()
    .then((data) => res.json(data.reverse()))
    .catch((err) => console.log(err));
});





//following system


// app.post("/getfollowers",async(req,res)=>{
//   await connectdb();
//   const userid = req.body.userid;

//   FollowersModel.findOne({userid:userid}).select("followers").populate("followers").then((d)=>{
//     return res.status(200).json(d);
//   }).catch((err)=>res.status(500).json(err));



// })


app.post("/getCurrentUser",async(req,res)=>{
 try {
  await connectdb();
  console.log(req.body.currentUserId);
  const currentUserId = req.body.currentUserId;
  const owner =req.body.owner;
  if(!currentUserId){
    return res.status(404).json({err:"User id is null"});
  }

  Users.findById(currentUserId).select("_id email displayName createdAt profilePic isAdmin").then(async(d)=>{
    const additionaldata =await AdditionalData.findOne({userid:currentUserId});
   const f = await FollowersModel.findOne({userid:currentUserId});
   const getProjects = await ProjectModel.find({uploadedBy:currentUserId});

   const isfowllinglist= await FollowersModel.findOne({userid:currentUserId}).select("followers -_id");

   const isFollowing = isfowllinglist.followers.includes(owner);
   

    return res.status(200).json({user:d,follow:{following:f.following.length,followers:f.followers.length},projectCount:getProjects.length,additonalData:additionaldata,isFollowing:isFollowing});
  }).catch((err)=>res.status(500).json({err:err}))


 } catch (error) {
  return res.status(500).json({err:error});
 }


})




app.post("/follow",async(req,res)=>{
  const MAX_RETRY_COUNT = 3; // Maximum number of retry attempts
  const RETRY_DELAY = 1000; // Delay in milliseconds before retrying
  

  await connectdb();
  const currentUserId = req.body.currentUserId;
  const followingUserId = req.body.whomToFollowUserId;


  const OtherfollowerList = await FollowersModel.findOne({userid:followingUserId});
  const MyfollowingList = await FollowersModel.findOne({userid:currentUserId});


  if(!OtherfollowerList || !MyfollowingList){
    return res.status(404).json({err:"User doesnot exist"});
  }

  const followerIdx = OtherfollowerList.followers.findIndex((val)=>val==currentUserId);
  const followingIdx = MyfollowingList.following.findIndex((val)=>val==followingUserId);
  

  if((followerIdx===-1&& followerIdx!==-1)|| (followerIdx!==-1 && followingIdx==-1)){
    return res.status(500).json({err:"Something Wrong with your userid"});
  }
  

  if(followerIdx==-1){
    OtherfollowerList.followers.push(currentUserId);
    MyfollowingList.following.push(followingUserId);
    const saveModels = (model1, model2, retryCount = 0) => {
      Promise.all([model1.save(), model2.save()])
        .then(async() => {
  
          const u = await Users.findById(currentUserId).select("displayName profilePic");
          const deviceToken = await DeviceToken.findOne({userid:followingUserId}).select("deviceToken -_id");
          if(deviceToken){
            const message = {
              data:{
                event:"follow",
                data:`${currentUserId}`,
              },
              image:`${u.profilePic}`,
              body:`${u.displayName} started following you ❤`
            }
          
            sendMessagec([`${deviceToken.deviceToken}`],message);
            
  
          }

          await NotificationModel.updateOne(
            { userid: followingUserId },
            { $push: { notifications: { senderUserId:currentUserId,type:"follow",contentId:currentUserId } } }
          );
  
         
  
          res.status(200).json({ deleted: true ,follow:true});
        })
        .catch((err) => {
          if (retryCount < MAX_RETRY_COUNT) {
            console.log(`Save operation failed, retrying (attempt ${retryCount + 1})`);
            setTimeout(() => {
              saveModels(model1, model2, retryCount + 1); // Retry the save operation
            }, RETRY_DELAY);
          } else {
            console.log(`Save operation failed after maximum retries (${MAX_RETRY_COUNT})`);
            res.status(500).json({ error: 'Failed to save models' });
          }
        });
    };
  
    saveModels(OtherfollowerList,MyfollowingList);
  }else{
    OtherfollowerList.followers.splice(followerIdx,1);
    MyfollowingList.following.splice(followingIdx,1);
    const saveModels = (model1, model2, retryCount = 0) => {
      Promise.all([model1.save(), model2.save()])
        .then(async() => {
          res.status(200).json({ deleted: true,unfollow:true });
        })
        .catch((err) => {
          if (retryCount < MAX_RETRY_COUNT) {
            console.log(`Save operation failed, retrying (attempt ${retryCount + 1})`);
            setTimeout(() => {
              saveModels(model1, model2, retryCount + 1); // Retry the save operation
            }, RETRY_DELAY);
          } else {
            console.log(`Save operation failed after maximum retries (${MAX_RETRY_COUNT})`);
            res.status(500).json({ error: 'Failed to save models' });
          }
        });
    };
  
    saveModels(OtherfollowerList,MyfollowingList);

  }
  

  // OtherfollowerList.save().then((other)=>{
  //   MyfollowingList.save().then((mine)=>{
  //     res.status(200).json({deleted:true});
  //   }).catch((err)=>{
  //     MyfollowingList.save();

  //   })
  // }).catch((err)=>res.status(500).json({err:err}))




})



//getfollowing




app.post("/getfollowing",async(req,res)=>{
 try {
  await connectdb();
  const whomtosearch = req.body.whomtosearch;
  const currentUserId = req.body.currentUserId;
  const offset = req.body.offset || 0;
  const limit = 10;



  const followerUser = await FollowersModel.findOne({userid:whomtosearch}).populate('following');




  const followerList = followerUser.following.slice(offset,offset+limit);


 const p = await new Promise(async (resolve, reject) => {
  try {
    const allfollowers = await Promise.all(followerList.map(async (user) => {
      
      const eachFollowerList = await FollowersModel.findOne({ userid: user.id }).select("followers").exec();

      const isFollowing = eachFollowerList.followers.includes(currentUserId);
      
      return {

        isFollowing: isFollowing,
        userid:{
          displayName:user.displayName,
          _id:user._id,
          profilePic:user.profilePic
        }
      };
    }));
  
    resolve(allfollowers);
  } catch (error) {
    reject(error);
  }
});




  res.json({id:followerUser._id,length:followerUser.following.length,data:p});

 } catch (error) {
  console.log(error);
 }

})






app.post("/sendNotification",async(req,res)=>{

  await connectdb();

const p = await  ProjectModel.countDocuments();
  // const deviceToken = (await DeviceToken.find().select("deviceToken -_id")).map((val)=>val.deviceToken);

  // const likedIndex = post.likedEmail.findIndex((val) => val == req.body.userid);

  

  // const message = {
  //   data:"Hello buddy",
  //   image:"https://drive.google.com/uc?export=download&id=1wnWDhAGztYCZBMmO_Dx9w98_sZMUb0_g",
  //   body:"Shyam has uploaded a project"
  //   // "sound"
  // }



  // const p = await sendMessagec(deviceToken,message);

  console.log(p);

 return res.json(p);

});





//handling community


app.post("/addCommunityMessage",upload.single("file"),async(req,res)=>{
  try {
    await connectdb();

    const currentUserId = req.body.currentUserId;
    const message = req.body.message;

   

    if(currentUserId.length<1 || message.length<1)
      return res.status(404).json({err:"Bad Request!"});
    




    if(req.file!=null){
      var fileMetadata = {
        name: req.file.originalname,

        parents: ["1dqvUovRlXlVRQaSohe2DVu7ZVIT5Minc"],
      };
      //   C:\Users\KIIT01\OneDrive\Desktop\KIIT_Project\test\kiit_university_app\pages\api\drive\video.mp4
      var media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(path.join(__dirname, req.file.path)),
      };
      drive.files.create(
        {
          auth: jwToken,
          resource: fileMetadata,
          media: media,
          fields: "id",
        },
        function (err, file) {
          if (err) {
            // Handle error
            console.error(err);
            fs.unlink(path.join(__dirname, req.file.path), (err) => {
              if (err) {
                console.log("Error Deleting file");
              } else {
                console.log("Deleted Sucessfully");
              }
            });
            console.log(err);
            return res.status(500).json({err:err});
          } else {
            console.log(file.data.id);
            CommunityModel.create({
              userid:currentUserId,
              message:message,
              image:file.data.id

              
            })
              .then(async(d) => {
                console.log(d);
                fs.unlink(path.join(__dirname, req.file.path), (err) => {
                  if (err) {
                    console.log("Error Deleting file");
                    console.log(err);
                    return;
                  }
                  console.log("Deleted Sucessfully");
                });

              
                // const deviceToken = (await DeviceToken.find().select("deviceToken")).map((val)=>val.deviceToken);
                // console.log(deviceToken);

                
                                 const deviceTokens = await DeviceToken.find({}).select("deviceToken -_id userid");
                
                
                                 const userIds = deviceTokens.map(deviceToken => deviceToken.userid.toString());
                                 const deviceTokenList = deviceTokens.map(deviceToken => deviceToken.deviceToken);

                const message = {
                  data:{
                    event:"community",
                    data:`${d._id==null?"Null id":d._id.toString()}`
                  },
                  image:`https://drive.google.com/uc?export=download&id=${file.data.id}`,
                  body: `Announcement: You have got Community Message`
                  // "sound"
                }
                


                 sendMessagec(deviceTokenList,message);
                 await NotificationModel.updateMany(
                  { userid: { $in: userIds } },
                  { $push: { notifications: { senderUserId:"64880b2133b33a1ef1cb782f",type:"communityMessage",contentId:"" } } }
                );

                // sendMessagec("")
                return res.status(200).json(d);
              })
              .catch((err) => {
                fs.unlink(path.join(__dirname, req.file.path), (err) => {
                  if (err) {
                    console.log("Error Deleting file");
                    console.log(err);
                    return;
                  }
                  console.log("Deleted Sucessfully");
                });
                console.log(err);
               
                return res.status(500).json({
                  err:err
                });
              });
          }
        }
      );
    }else{

      CommunityModel.create({
        userid:currentUserId,
        message:message,
        image:null
      }).then(async(r)=>{
        console.log(r);
        // const deviceToken = (await DeviceToken.find().select("deviceToken")).map((val)=>val.deviceToken);
        const deviceTokens = await DeviceToken.find({}).select("deviceToken -_id userid");
                
                
        const userIds = deviceTokens.map(deviceToken => deviceToken.userid.toString());
        const deviceTokenList = deviceTokens.map(deviceToken => deviceToken.deviceToken);
        const message = {
          data:{
            event:"community",
            data:``
          },
          image:``,
          body: `Announcement: You have got Community Message`
          // "sound"
        }
        

         sendMessagec(deviceTokenList,message);
         console.log(deviceTokenList);
         await NotificationModel.updateMany(
          { userid: { $in: userIds } },
          { $push: { notifications: { senderUserId:"64880b2133b33a1ef1cb782f",type:"communityMessage",contentId:"" } } }
        );
       return res.status(200).json(r);
      }).catch((err)=>{
        throw err;
      })
    }

   
  } catch (error) {
    console.log(err);
 return   req.json(error);
  }
  })



  app.post("/getCommunityMessage",async(req,res)=>{
    try {
      await connectdb();
      const currentUserId=req.body.currentUserId;
      const pageNo = req.body.pageNo;
      const limit = 10;

      const checkUser = await Users.findById(currentUserId);
      if(!checkUser){
        return res.status(401).json({err:"Unauthorized Access"});
      }

      const kiitConnectProfile = await Users.findOne({email:"connectkiit@gmail.com"}).select("_id");
      console.log(kiitConnectProfile);


      const totalDocuments = await CommunityModel.countDocuments();
      const skipCount = Math.max(totalDocuments - (pageNo + 1) * limit, 0);
      
      CommunityModel.find().skip(skipCount).limit(limit).then((r) => {
        return res.status(200).json({ data: r, length: totalDocuments,connectKiit:kiitConnectProfile });
      }).catch((err)=>{throw err})
    } catch (error) {
      return res.status(500).json({err:error});
    }
  })

app.post("/deleteCommunityMessage",async(req,res)=>{
  try {
    await connectdb();
    

    const currentUserId = req.body.currentUserId;
    const postId = req.body.postid;

    console.log(currentUserId,postId);

    CommunityModel.findOneAndDelete({_id:postId,userid:currentUserId}).then((r)=>{
      return res.status(200).json({deleted:true});
    }).catch((err)=>{
      throw err;
    })
  } catch (error) {
    req.json(error);
  }
  })




  //getting notifications


//   app.post("/getNotifications",async(req,res)=>{

//     try {
      
//       await connectdb();

//       const offset = req.body.offset;
//       const limit = 20;


// console.log(req.body.currentUserId);
//     const noti = await NotificationModel.findOne({userid:req.body.currentUserId}).select("notifications -_id").populate("notifications.senderUserId","displayName _id profilePic");

//     if(!noti){
//       return console.log("error");
//     }

//     const notifications = noti.notifications;

//     const totalLength = notifications.length;
//     const paginatedNotifications = notifications.slice(offset, offset + limit);

//     // console.log(noti.notifications);



// return res.status(200).json({length:totalLength,notification:paginatedNotifications});



//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({err:error})
//     }
//   })
  

app.post("/getNotifications", async (req, res) => {
  try {
    await connectdb();

    const offset = req.body.offset;
    const limit = 10;
    const currentUserId = req.body.currentUserId;

    const noti = await NotificationModel.findOne({ userid: currentUserId })
      .select("notifications -_id")
      .populate("notifications.senderUserId", "displayName _id profilePic");

    if (!noti || !noti.notifications) {
      return res.status(404).json({ error: "No notifications found" });
    }

    const notifications = noti.notifications;

    const totalLength = notifications.length;
    const paginatedNotifications = notifications.reverse().slice(offset, offset + limit);

    return res
      .status(200)
      .json({ length: totalLength, notification: paginatedNotifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log("Server is listening on Port 5000");
});
