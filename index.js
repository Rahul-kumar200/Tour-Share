const express = require('express');
const cors= require('cors');
const checkviamail =  require('./mailsender');
const app = express();
app.use(express.json());
let {connectToDb , getDb} = require('./db')
app.use(cors());
const PORT =  process.env.PORT || 8000;
let db;

// checking connection to database
connectToDb((err)=>{
    if(!err){
        app.listen(PORT,()=>{
            console.log("Listening to port 8000...")
        })
        db = getDb();
    }else{
        console.log(err)
    }
})


app.post('/api/signin',(req,res)=>{
    db.collection('tourshare')
    .findOne({email : req.body.email , password : req.body.password})
    .then((doc)=>{
        if(doc===null){
            res.json({errorCode : 1 , msg : 'No user found with this data'})
        }
        else{
            res.json({errorCode : 0 , msg : 'user found' , info : doc});
        }
    })
})

let OTP;
let username ;
let password;
let email ;
let phone ; 
app.post('/api/signup',(req,res)=>{
    db.collection("tourshare")
    .findOne({email : req.body.email})
    .then((doc)=>{
        if(doc===null){
            const sent_otp = checkviamail(req.body.email);
            OTP = sent_otp;
            username = req.body.username;
            password = req.body.password;
            email = req.body.email;
            phone = req.body.phone;


            res.json({errorCode:0 , msg : 'Otp send successfully'})
        }
        else{
            res.json({errorCode : 1 , msg : "Already logged in with this email."})
        }
    })
})

app.post('/api/verifyotp',(req,res)=>{
    if(req.body.otp==OTP){
        db.collection("tourshare").insertOne({
             username : username,
             email : email,
             password : password,
             phone : phone,
             time : '',
             location : '',
             date : '',
             numberOfPerson : '',
          });
          res.json({errorCode : 0 , msg: "success" });
    }
    else {
        res.json({errorCode : 1 , msg : "OTP not matched"})
    }
})


app.post('/api/bookmyslot',(req,res)=>{
    db.collection('tourshare')
    .findOne({email : req.body.email})
    .then((doc)=>{
        if(doc===null){
            res.json({errorCode : 1 , msg : 'internal Server Error'})
        }
        else{
            let collection = db.collection('tourshare')
            let filter = {email : req.body.email}
            let update = {$set : {time : req.body.time , location : req.body.location , date : req.body.date , numberOfPerson : req.body.numberOfPerson}}
            collection
            .updateOne(filter,update)
            .then((result)=>{
                if (result.matchedCount === 1) {
                    res.json({ errorCode : 0 , msg : 'Successsful'});
                  } else { 
                    res.json({ errorCode : 1 ,  msg: "failure", });
                  }
            })
            .catch((error) => {
                console.error("Error updating document:", error);
                res
                  .status(500)
                  .json({
                    status: "failure",
                    message: "An error occurred while updating document",
                  });
              });
        }
    })
})

app.post('/api/getdateData',async (req,res)=>{
    let filteredData=[];

    
    const cursor = db.collection('tourshare').find();

    await cursor.forEach(doc => {
        if(doc.location ===req.body.location && doc.date === req.body.date)
        {
            filteredData.push({username : doc.username , phone : doc.phone , numberOfPerson : doc.numberOfPerson , time : doc.time});
        }
      });

      res.json(filteredData)

}) 