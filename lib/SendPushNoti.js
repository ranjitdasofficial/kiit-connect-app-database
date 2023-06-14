
const fcm = require("@diavrank/fcm-notification");
const admin = require('firebase-admin');
// const tokenkey = require("./kiitconnectlive-firebase-admins.json");

// import tokenKey from "./kiitconnectlive-firebase-admins.json"


const tokenkey = require("../kiitconnectlive-firebase-admins.json");
// const { connectdb } = require("../db/db");

// /home/technicalranjit/Desktop/kiit-connect-app-database/kiitconnectlive-firebase-admins.json
var Fcm = new fcm(tokenkey);






const sendMessagec= async(deviceToken,msg)=>{

// await connectdb();
    // console.log("message",msg['data'],msg['image']);

    var message = {
        data: msg['data'],
        notification: {
          body: msg['body'],
          title: "KIIT CONNECT",
          // "android_channel_id": "pushnotificationapp",
          image:msg['image']
            // "https://drive.google.com/uc?export=download&id=1wnWDhAGztYCZBMmO_Dx9w98_sZMUb0_g",
          // "sound": false
        },
    
        android: {
          notification: {
            channelId: "kiitconnect",
            image:msg['image']
            //   "https://drive.google.com/uc?export=download&id=1wnWDhAGztYCZBMmO_Dx9w98_sZMUb0_g", // Specify your desired channel ID
            // URL of the image to be displayed in the notification for Android
          },
        },
     
      };
    
      Fcm.sendToMultipleToken(message,deviceToken, function (err, response) {
        if (err) {
          console.log("error found", err);
         return err
        } else {
          // console.log('response here', response);
          return response;
        }
      });
}


module.exports = sendMessagec

// module.exports = sendMessage=(deviceToken,msg)=>new Promise((resolve,reject)=>{
//     var message = {
//         data: {
//           //This is only optional, you can send any data
//           data: msg['data'],
//         },
//         notification: {
//           body: msg['body'],
//           title: "KIIT CONNECT",
//           // "android_channel_id": "pushnotificationapp",
//           image:msg['image']
//             // "https://drive.google.com/uc?export=download&id=1wnWDhAGztYCZBMmO_Dx9w98_sZMUb0_g",
//           // "sound": false
//         },
    
//         android: {
//           notification: {
//             channelId: "kiitconnect",
//             image:msg['image']
//             //   "https://drive.google.com/uc?export=download&id=1wnWDhAGztYCZBMmO_Dx9w98_sZMUb0_g", // Specify your desired channel ID
//             // URL of the image to be displayed in the notification for Android
//           },
//         },
//         token: deviceToken,
//       };
    
//       Fcm.send(message, function (err, response) {
//         if (err) {
//           console.log("error found", err);
//          reject(err);
//         } else {
//           // console.log('response here', response);
//           resolve(response);
//         }
//       });


// })
//     const token =
//   "c7aJqo3FTGOxcGg04ph8lg:APA91bE0RntyMwVmp_53SdLMEZkbmGHH6q8zu-3z9ESMTNbhuJ4FAfRTitZU49-YwPkiMOCJvoLkKLL789GGycjWUJfQVlf6twCdxa_On1LPBiq1kOWuTXisYrFpQHXbm14oHcvK5R4N";


 

