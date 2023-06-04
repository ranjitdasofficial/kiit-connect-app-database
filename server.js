const express = require("express");
const { connectdb } = require("./db/db");
const AdditionalData = require("./models/AdditionalInfo");
const cors = require("cors");

const multer = require("multer")
const fs = require("fs");

const Users = require("./models/User");
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
// const PORT =  5000;

app.get("/", (req, res) => {
  res.status(200).json({ connection: true });
});


const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}




let counter= 0;
app.get("/data", async(req, res) => {

  
  const data = [{
    "id": "1",
    "firstName": "Tomw",
    "lastName": "Cruise",
    "photo": "https://jsonformatter.org/img/tom-cruise.jpg"
    },
    {
    "id": "2",
    "firstName": "Maria",
    "lastName": "Sharapova",
    "photo": "https://jsonformatter.org/img/Maria-Sharapova.jpg"
    },
    {
    "id": "3",
    "firstName": "Robert",
    "lastName": "Downey Jr.",
    "photo": "https://jsonformatter.org/img/Robert-Downey-Jr.jpg"
    }];

    await delay(3000);
counter++;
    console.log(counter);
    return res.json(data);
});

app.get("/data2", async(req, res) => {

  
  const data = [{
    "id": "1",
    "firstName": "Ram",
    "lastName": "Cruise",
    "photo": "https://jsonformatter.org/img/tom-cruise.jpg"
    },
    {
    "id": "2",
    "firstName": "Maria",
    "lastName": "Sharapova",
    "photo": "https://jsonformatter.org/img/Maria-Sharapova.jpg"
    },
    {
    "id": "3",
    "firstName": "Robert",
    "lastName": "Downey Jr.",
    "photo": "https://jsonformatter.org/img/Robert-Downey-Jr.jpg"
    }];

    await delay(3000);
counter++;
    console.log(counter);
    return res.json(data);
});



const nodemailer = require('nodemailer');

// Create a transport object
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mail.server.hib@gmail.com',
        pass: 'wbrknqwssdophyyd'
    }
});


// AUTH_EMAIL = mail.server.hib@gmail.com
// AUTH_PASSWORD = wbrknqwssdophyyd

// Set options for the message


// Send the email


app.post("/report",async(req,res)=>{

    var rp = await sendMail(req.body.message,req.body.senderEmail,req.body.senderName);
    res.json(rp);
  
})

const sendMail = (message,senderEmail,senderName)=>new Promise((resolve,reject)=>{
  let mailOptions = {
    from: '"KIIT CONNECT"<no-reply@kiitconnect.live>',
    to: 'technicalranjit@gmail.com',
    subject: `Feedback/Report from : ${senderName} : ${senderEmail} `,
    text: `${message}`
};
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
       reject({message:"Error Occured",success:false});
    } else {
        // console.log('Email sent: ' + info.response);
        resolve({message:"Your response has been recorded",success:true});
    }
});
})








app.post("/api/auth/getAditionalInfo",async(req,res)=>{
  try {
    await connectdb();
    const data = await AdditionalData.findOne({email:req.body.email});
    if(data){
      res.json({success:true,data:data});
    }else{
      res.json({success:false});
    } 
  } catch (error) {
    res.json({success:false});
  }
})


app.post("/test",async(req,res)=>{
  console.log(req.body.email);
  res.json({success:false});
})




app.post("/api/auth/UpdateAdditional",async(req,res)=>{

  console.log(req.body.batch,req.body.branch,req.body.email);
  try {

    await connectdb();
    const checkDataExist = await AdditionalData.findOne({email:req.body.email});

    if(checkDataExist){
      const batch = req.body.batch;
      const branch = req.body.branch;
     const currentSemester = req.body.currentSemester;
     const currentYear= req.body.currentYear;
     const github = req.body.github;
     const hackerRank = req.body.hackerRank;
     const linkedin = req.body.linkedin;
     const others = req.body.others;
     const yop = req.body.yop;
    
    

      const up = await AdditionalData.updateOne(
        { email: req.body.email },
        { $set: {batch : batch,branch:branch,currentSemester:currentSemester,currentYear:currentYear,github:github,hackerRank:hackerRank,linkedin:linkedin,others:others,yop:yop } }
      );
      if(up.modifiedCount>0){
        return res.json({success:true,message:"Data has been updated",modified:true});
      }else{
        return res.json({success:false,message:"Something went Wrong!!",modified:false});
      }
    }else{
     
      const batch = req.body.batch;
      const branch = req.body.branch;
     const currentSemester = req.body.currentSemester;
     const currentYear= req.body.currentYear;
     const github = req.body.github;
     const hackerRank = req.body.hackerRank;
     const linkedin = req.body.linkedin;
     const others = req.body.others;
     const yop = req.body.yop;

     AdditionalData.create({
      email:req.body.email,
      batch:batch??"Set",
      branch:branch??"Set",
      currentSemester:currentSemester??"Set",
      currentYear:currentYear??"Set",
      github:github??"Set",
      hackerRank:hackerRank??"Set",
      linkedin:linkedin??"Set",
      others:others??"Set",
      yop:yop??"Set"

     }).then(()=>{
      return res.json({success:true,message:"Data has been updated",modified:true});
     }).catch((err)=>{
      return res.json({success:false,message:"Something went Wrong!!"});
     })
    }
    
  } catch (error) {
    console.log(error);
    return res.json({success:false,message:"Something went Wrong!!"});
  }
})


app.post("/getAllUsers",async(req,res)=>{
  try {
    await connectdb();
    const users = await Users.find({}).select("-password");
    if(!users){
      return res.json({success:false,message:"Cannot Reach to Server",data:null});
    }
    return res.json({success:true,message:"Data Fetched Sucessfully",data:users});
  } catch (error) {
    return res.json({success:false,message:"Internal Error",data:null});
  }
})

app.post("/getAllUsersAddtional",async(req,res)=>{
  try {
    await connectdb();
    const users = await AdditionalData.find({});
    if(!users){
      return res.json({success:false,message:"Cannot Reach to Server",data:null});
    }
    return res.json({success:true,message:"Data Fetched Sucessfully",data:users});
  } catch (error) {
    return res.json({success:false,message:"Internal Error",data:null});
  }
})

app.post("/api/auth/additionalInfo",async(req,res)=>{

  try {
    await connectdb();

    const checkDataExist = await AdditionalData.findOne({email:req.body.email});
    if(!checkDataExist){
      const batch = req.body.batch;
      const branch = req.body.branch;
     const currentSemester = req.body.currentSemester;
     const currentYear= req.body.currentYear;
     const github = req.body.github;
     const hackerRank = req.body.hackerRank;
     const linkedin = req.body.linkedin;
     const others = req.body.others;
     const yop = req.body.yop;

     AdditionalData.create({
      email:req.body.email,
      batch:batch??"Set",
      branch:branch??"Set",
      currentSemester:currentSemester??"Set",
      currentYear:currentYear??"Set",
      github:github??"Set",
      hackerRank:hackerRank??"Set",
      linkedin:linkedin??"Set",
      others:others??"Set",
      yop:yop??"Set"

     }).then((data)=>{
     return res.json({success:true,message:"Sucessfully Added!!",data:data,newUser:true});
     }).catch((err)=>{
      if(err){
      return  res.json({success:false,message:"Couldn't added!! Something Went Wrong!!",err:err});
      }
     })
    }else{
     return res.json({sucess:true,message:"Already Exist",newUser:false});
    }

  } catch (error) {
    return res.json({success:false,message:"Couldn't added!! Something Went Wrong!!",err:err});
  }
})

app.post("/api/auth/signup", async (req, res) => {
  try {
    await connectdb();
    const email = req.body.email;
    // console.log(email);
    const user = await Users.findOne({ email: req.body.email });
    // const user = await Users.findOne();
    // console.log(user);
    const accessToken = req.body.authToken ? req.body.authToken : "invalid";
    const isAppuser = true;
    const displayName = req.body.displayName;
    const profilepic = req.body.profilePic;
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
          // const users = {
          //   user:{
          //     id:users._id,
          //   }
          // };
          // console.log(u);
          // const token =  jwt.sign(u,"PandaSecurity");
          return res.json({ success: true,newUser:true, message: "Signup Sucessfully" });
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            success: false,
            message: "Something went wrong!!!",
          });
        });
    } else {
      if (!user.verified) {
        const up = await Users.updateOne(
          { _id: user.id },
          { $set: { verified: true } }
        );
        if (up.modifiedCount > 0) {
          console.log("User is Verified");
          UserVerification.findOneAndDelete({ userId: user.id }).catch(
            (err) => {
              console.log(err);
            }
          );
        } else {
          console.log("User is Not Verified");
        }
      }

      //   const u = {
      //     user:{
      //       id:user._id,
      //     }
      //   };
      // console.log("userl",user);
      // const token = jwt.sign(u,"PandaSecurity");
      // return done(null,user,{message:"Auth Sucessfull",token,profile});
      return res.json({ success: true,newUser:false, message: "Auth Successfull" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Something Went Wrong!!" });
  }
});





//uploading images to google drive

const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where uploaded files will be stored
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Specify a unique name for the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the Multer upload instance
const upload = multer({ storage: storage });







const { google } = require("googleapis");
// const fs = require("fs");
// const path = require("path");

const key = require("./cred.json");
const ProjectModel = require("./models/ProjectModel");
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



app.post('/upload', upload.single('file'), async(req, res) => {
  
  try {

    await connectdb();

   
    if(req.file!=null){
      var fileMetadata = {
        name: req.file.originalname,
  
        parents:["1dqvUovRlXlVRQaSohe2DVu7ZVIT5Minc"]
       
      
      }
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
            fs.unlink(path.join(__dirname,req.file.path),(err)=>{
              if(err)
              {
                console.log("Error Deleting file");
                
              }else{
                console.log("Deleted Sucessfully");
              }
            });
           return res.json({success:false,message:"Error "});
          } else {
  
            console.log(file.data.id);
            ProjectModel.create({
              projectName:req.body.projectName,
              projectDesc:req.body.projectDesc,
              githubUrl:req.body.githubUrl,
              liveUrl:req.body.liveUrl,
              projectImage:file.data.id,
              createdDate:new Date(),
              uploadedBy:req.body.uploadedBy,
              likeCount:0,
              email:req.body.email,
              profilePic:req.body.profilePic,
              active:true,
              likedEmail:[]
            }).then((d)=>{

              fs.unlink(path.join(__dirname,req.file.path),(err)=>{
                if(err)
                {
                  console.log("Error Deleting file");
                  return;
                }
                console.log("Deleted Sucessfully");
              });
             return res.json({success:true,message:"File has been created ",file:file,});

            }).catch((err)=>{
              fs.unlink(path.join(__dirname,req.file.path),(err)=>{
                if(err)
                {
                  console.log("Error Deleting file");
                  return;
                }
                console.log("Deleted Sucessfully");
              });
             return res.json({success:false,message:"Error Something went wrong!"})});
          }




        }
      );
      
    }else{
      ProjectModel.create({
        projectName:req.body.projectName,
        projectDesc:req.body.projectDesc,
        githubUrl:req.body.githubUrl,
        liveUrl:req.body.liveUrl,
        projectImage:null,
        createdDate:new Date(),
        uploadedBy:req.body.uploadedBy,
        likeCount:0,
        email:req.body.email,
        profilePic:req.body.profilePic,
        active:true,
        likedEmail:[]
      }).then((d)=>{
       return res.json({success:true,message:"File has been created ",});
      }).catch((err)=>{
        
        console.log(err);
        res.json({success:false,message:"Error Something went wrong!"})
    
    
    });
    }

    
  
    
  } catch (error) {

    console.log(err);

    return res.json({success:false,message:"Error Something went wrong!"});
    // console.log(error);
  }

  
})


app.post("/like",async(req,res)=>{

    try {
      await connectdb();
      console.log(req.body.likedEmail);
      const up = await ProjectModel.updateOne(
        { _id: req.body.id },
        { $set: {likedEmail:req.body.likedEmail} },
        {new:true}
      ).then((updatedoc)=>{
        console.log(updatedoc);
        res.json({mes:updatedoc})
      }).catch((err)=>{
        console.log({err:err});
        res.json(err);
      });

      // console.log(up);
      // if(up.modifiedCount>0){
      //   return res.json({success:true,message:"Data has been updated",modified:true});
      // }else{
      //   return res.json({success:false,message:"Something went Wrong!!",modified:false});
      // }
      
      
    } catch (error) {
      return res.json({success:false,message:error,modified:false});
          
    }
  }

 
);



app.get("/rand",async(req,res)=>{
  await connectdb();

    ProjectModel.find({active:true}).then((data)=>
    
    {

      for (let i = data.length-1; i>0; i--) {
        let j = Math.floor(Math.random() * (i+1))

        let temp = data[i];
        data[i]=data[j];
        data[j] = temp;
        
      }

      res.json(data);
    }
    
    ).catch((err)=>console.log(err));
})


app.get("/getfiles",async(req,res)=>{
  fs.readdir(path.join(__dirname,"uploads/"),(err,files)=>{
    if(err){
      return res.json({err:err});
    }
    return res.json({files:files});
  });
})


app.post("/deleteProject",async(req,res)=>{
  try {

    console.log("deleting....");
    await connectdb();

    ProjectModel.findOneAndDelete({
      _id:req.body.id,
      email:req.body.email
    }).then((val)=>{

      console.log(val);
     return res.json({success:true,message:"Item Deleted Sucessfully"});
    }).catch((err)=>res.json({success:false,message:"Something went wrong!!"}))

  } catch (error) {
    return res.json({success:false,message:error})
  }
})


app.get("/allProject",async(req,res)=>{

    await connectdb();

    ProjectModel.find().then((data)=>res.json(data)).catch((err)=>console.log(err));
  
})

app.listen(PORT, () => {
  console.log("Server is listening on Port 5000");
});
