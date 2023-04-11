const express = require("express");
const { connectdb } = require("./db/db");
const AdditionalData = require("./models/AdditionalInfo");
const cors = require("cors");

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

app.listen(PORT, () => {
  console.log("Server is listening on Port 5000");
});
