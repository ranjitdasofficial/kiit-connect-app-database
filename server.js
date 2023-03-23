const express = require("express");
const { connectdb } = require("./db/db");

const  Users = require("./models/User");
const app =express();
app.use(express.json())

const PORT = 5000 || process.env.PORT;


app.post("/api/auth/signup",async(req,res)=>{
    try {
        await connectdb();
        const email = req.body.email;
        // console.log(email);
        const user = await Users.findOne({email:req.body.email});
        // const user = await Users.findOne();
        // console.log(user);
        const accessToken=req.body.authToken?req.body.authToken:"invalid";
        const isAppuser=true;
        const displayName =req.body.displayName;
        const profilepic=req.body.profilePic;
        if(!user){
            Users.create({
                email:req.body.email,
                verified:true,
                accessToken:accessToken,
                displayName:displayName,
                profilePic:profilepic,
                createdAt: Date.now(),
                password:null,
                isAppuser:isAppuser,

            }).then(async(users)=>{
                // const users = {
                //   user:{
                //     id:users._id,
                //   }
                // };
                // console.log(u);
                // const token =  jwt.sign(u,"PandaSecurity");
              return  res.json({success:true,message:"Signup Sucessfully"});
            }).catch((err)=>{
                console.log(err);
                return  res.json({success:false,message:"Something went wrong!!!"});
            })
        }else{

          if(!user.verified){
            const up = await Users.updateOne({_id:user.id},{$set:{verified:true}});
            if(up.modifiedCount>0){
              console.log("User is Verified");
              UserVerification.findOneAndDelete({userId:user.id}).catch((err)=>{console.log(err)});
            }else{
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
            return  res.json({success:true,message:"Auth Successfull"});
        }
    } catch (error) {
        console.log(error);
        return  res.json({success:false,message:"Something Went Wrong!!"});
    }
})

app.listen(PORT,()=>{
    console.log("Server is listening on Port 5000");
})