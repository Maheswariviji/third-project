const User=require('../model/user');
const Chat=require('../model/chat');
const config = require('../config/database'); 
const passport = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
const nodemailer = require('nodemailer');
const router = require('express').Router();
const jwt = require('jsonwebtoken'); 
let friendsArray=[];
let chatArray=[];
   let arr=[];
   let wmsg=[];

passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {
    	
        if (email)
            email = email.toLowerCase(); 
        process.nextTick(function() {
          if(req.body.email){
 User.findOne({ 'local.email' :  email }, function(err, user) {
  if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, {message: 'That email is already taken.'});
                        
                    } else {
                    	 
                        var newuser = new User();
                        newuser.local.email = req.body.email;
                        newuser.local.username = req.body.username;
                           newuser.local.onlineStatus = 'N';
                        newuser.local.password = newuser.generateHash(req.body.password);
                        newuser.save(function (err) {
                            if (err){
                            	
                                return done(err);
                            }else{
                            	
                            return done(null,newuser);
                           
                            }
                        });
                    }
 });
          }
          
        });

    }));


router.post('/registerauth',(req, res,next) => {

  passport.authenticate('local-signup', function(err, user, info) {
if (user === false) {
res.json({ success: true, message: 'not registered!' });
      return res.redirect('/register');
    } else {
    	 var transporter = nodemailer.createTransport({
             service: 'gmail',
             auth: {
               user: 'sampletask04@gmail.com',
               pass: 'sampletask004'
             }
           });

           var mailOptions = {
             from: 'sampletask04@gmail.com',
             to: user.local.email,
             subject: 'Sending User Credential',
             html:
                 "<header align='center'>" +
                  +
                  "<div align='center'> Hello  <strong>"+ user.local.username + "</strong>,<br><br> chatApp,your are account was successfully registered."+
                 "</div><div class='flex-container'>" 
                  +
                  "</div> "
           };

           transporter.sendMail(mailOptions, function(error, info){
             if (error) {
               console.log(error);
             } else {
               console.log('Email sent: ' + info.response);
             }
           });
            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); 
                res.json({ success: true, message: "Account registered! "+user.local.username, token: token, user: { username: user.local.username ,id:user._id}}); 

     
    }
  })(req, res, next);
});

router.get('/checkEmail/:email', (req, res) => {
   
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided' }); 
    } else {
      
      User.findOne({ 'local.email': req.params.email.toLowerCase() }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); 
        } else {
          
          if (user) {
            res.json({ success: false, message: 'E-mail is already taken' }); 
          } else {
            res.json({ success: true, message: 'E-mail is Available' }); 
          }
        }
      });
    }
  });
router.get('/checkEmailForLogin/:email', (req, res) => {
	   
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided!!' }); 
    } else {
      
      User.findOne({ 'local.email': req.params.email.toLowerCase() }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); 
        } else {
          
          if (user) {
        	  console.log(user);
            res.json({ success: true, message: 'E-mail is Available!!' }); 
          } else {
            res.json({ success: false, message: 'E-mail not found!!' }); 
          }
        }
      });
    }
  });


 
  router.get('/checkUsername/:username', (req, res) => {
    
    if (!req.params.username) {
      res.json({ success: false, message: 'Username was not provided' }); 
    } else {
      
      User.findOne({ 'local.username': req.params.username.toLowerCase()}, (err, user) => { 
        if (err) {
          res.json({ success: false, message: err }); 
        } else {
          
          if (user) {
            res.json({ success: false, message: 'Username is already taken' }); 
          } else {
            res.json({ success: true, message: 'Username is Available' }); 
          }
        }
      });
    }
  });

router.get('/search',(req,res)=>{
 
  User.find({},function(err,user){
     if (err) {
          res.json({ success: false, message: err }); 
        } else {
          if (user) {
            res.json({ success: true, message: 'user details', user:user});
  }
}
  });
});

router.post('/userSessionCheck',(req,res) =>{

      let userId = req.body.userId;
      console.log(userId);
      let sessionCheckResponse = {}
      
      if (userId == '') {

        sessionCheckResponse.error = true;
              sessionCheckResponse.message = 'User Id cant be empty.';
             res.json({ success: false, message: sessionCheckResponse.message }); 

      }else{
        User.findOne({ '_id': req.body.userId, 'onlineStatus':'Y'}, (err, user) => { 
        if (err) {
          console.log("err");
          res.json({ success: false, message: err }); 
        } else {
          
          if (user) {
            console.log("user already online ");
            res.json({ success: false, message: 'already online ' }); 
          } else {
                   
            res.json({ success: true, message: 'Available'}); 
          }
        }
      });

        }
    });
  router.put('/update/:id', function(req, res){
    console.log("update");
    console.log(req.body);
       console.log(req.params.id);

     User.findOneAndUpdate({_id:req.params.id},{$set:{"local.onlineStatus":'N',"local.socketId":''}},function(err,user){
  if(err){
    console.log("error");
    }
    else
    {
       console.log("disconnect called");
      console.log("after Logout user data");
console.log(user);
res.json({data:user,success:true,message:'Updated'});
}
});
   });
router.get('/getuser/:id', function(req, res) {
  console.log("user id");
  console.log(req.params.id);
    User.find({
        '_id': req.params.id
    }, function(err, data) {
        if (err) {
            res.json(err);
        } else {
            console.log("backend socket id");
            console.log(data.length);
             for(let i=0; i < data.length; i++){
              console.log(data[i].local.socketId);
                  res.json({details:data[i].local.socketId,name:data[i].local.username,success:true,message:'Got Socket ID',userData:data[i]});
             }
        }
    });
});

  router.put('/addFriend/:id', function(req, res){

    console.log("Add friend");
    console.log(req.body);
       console.log(req.body.toId);
   User.findOne({
            _id: req.body.toId
        }, function(err, data) {
            if (err) {
                res.json(err);
            } else {
console.log("from user details");
console.log(data);
console.log(data.local.friends);
       friendsArray=data.local.friends;
let len=friendsArray.length;
console.log(len);

const details = {
            id: req.body.id,
            name:req.body.name,
            emailid:req.body.emailid
          }
friendsArray.push(details);
console.log(friendsArray);
console.log("aftrer pushing db");
console.log(friendsArray.length);
console.log(friendsArray);
const resData={ id: data._id,
            name:data.local.username,
            emailid:data.local.email,
            toId:req.body.id
          }

      console.log("slice waiting list");
console.log(data.local.waitingList);
console.log(data.local.waitingList.length);
let wlen=data.local.waitingList.length;
for(let i = 0; i<wlen; i++){
 
  arr=data.local.waitingList;
 if(arr[i].id==req.body.id){
  console.log("waiting matched list");
  console.log(arr[i]);
        arr.splice(i,1); 
         }
  }
User.findOneAndUpdate({_id:req.body.toId},{$set:{"local.friends":friendsArray,"local.waitingList":arr}},function(err,docs){
  if(err){
    console.log("error");
    }
    else
    {
  console.log("slice waiting list-response");
      console.log(docs);
console.log(docs.local.waitingList);
console.log(docs.local.waitingList.length);
res.json({info:resData,success:true,message:'Added Friend'});
}
  });

}

});

   });
    router.put('/reqFriend/:id', function(req, res){
      console.log('reqFriend');
console.log(req.body);
       console.log(req.body.toId);
   User.findOne({
            _id: req.body.toId
        }, function(err, data) {
            if (err) {
                res.json(err);
            } else {
console.log("from user details");
console.log(data);

       console.log(data.local.friends);
       friendsArray=data.local.friends;
let len=friendsArray.length;
console.log(len);
const details = {
            id: req.body.id,
            name:req.body.name,
            emailid:req.body.emailid
          }
friendsArray.push(details);

console.log(friendsArray);

User.findOneAndUpdate({_id:req.body.toId},{$set:{"local.friends":friendsArray}},function(err,docs){
  if(err){
    console.log("error");
    }
    else
    {
console.log(docs);
res.json({success:true,message:'Added  request Friend'});
    }
  });

}

});

   });
  

  router.put('/status/:id', function(req, res){
    console.log("status change");
    console.log(req.body);
       console.log(req.params.id);
  User.findOne({
            _id: req.params.id
        }, function(err, data) {
            if (err) {
                res.json(err);
            } else {
            console.log("data");
            console.log(data);
            console.log(data.local.onlineStatus);
            if(data.local.onlineStatus=='Y'){
                 User.findOneAndUpdate({_id:req.params.id},{$set:{"local.onlineStatus":'N'}},function(err,user){
  if(err){
    console.log("error");
    }
    else
    {
    
console.log(user);
res.json({data:user,success:true,message:'Off Status Changed',status:false});
}
});
            }
            else
            {
                      User.findOneAndUpdate({_id:req.params.id},{$set:{"local.onlineStatus":'Y'}},function(err,data){
  if(err){
    console.log("error");
    }
    else
    {
    
res.json({data:user,success:true,message:'On Status Changed',status:true});
}
});
            }
            }
           });
  
   });


    router.put('/waitmsg/:id', function(req, res){
console.log("offline messages");
  User.findOne({_id:req.params.id},function(err,data){
  if(err){
    console.log("error");
    }
    else
    {
// console.log(user);
console.log(data);
console.log(data.local.friends);
       friendsArray=data.local.friends;
let msglen=friendsArray.length;
for(let i = 0; i<msglen; i++){
  if(friendsArray[i].id==req.body.fromUserId){
    console.log(friendsArray[i].msg);
    console.log(friendsArray[i].msg.length);
    wmsg=friendsArray[i].msg;
    wmsg.push(req.body);
 console.log(wmsg);
  }
}
console.log("after adding msg to friend array");
console.log(friendsArray);
 User.findOneAndUpdate({_id:req.params.id},{$set:{"local.friends":friendsArray}},function(err,user){
  if(err){
    console.log("error");
    }
    else
    {
console.log(user);
res.json({data:user,success:true,message:'add waiting msg'});
}
});
}
});
    });


router.post('/addmsg', function(req, res) {
  console.log("msg length");
  console.log(req.body);
  console.log(req.body.length);
  let ln=req.body.length;
  console.log(ln);
  console.log(req.body.fromUserId);
  console.log(req.body[0].fromUserId);

console.log("msg length is greater than 1");
  let msglen=req.body.length;
for(let i = 0; i<msglen; i++){
  let newchat = new Chat();
    newchat.fromUserId = req.body[i].fromUserId;
    newchat.toUserId = req.body[i].toUserId;
    newchat.message = req.body[i].message;
    newchat.date = req.body[i].date;
newchat.fromUserName=req.body[i].fromUserName,
         newchat.toUserName=req.body[i].toUserName
    newchat.save(function(err,msg) {
        if (err) {
            return res.json(err);
           
             console.log("error");
        } else {

           console.log("saving");
           console.log(msg);
         }
    });
}
return res.send({success:true,message:'chat message saved!'});

});

router.put('/deletemsg/:id', function(req, res){
  console.log("delete msg");
  console.log(req.params.id);
  console.log(req.body);
  console.log(req.body.fromid);
 User.findOne({_id:req.params.id},function(err,d){
  if(err){
    console.log("error");
    }
    else
    {
    console.log(d);
console.log(d.local.friends);
       friendsArray=d.local.friends;
let msglen=friendsArray.length;
for(let i = 0; i<msglen; i++){
  console.log(friendsArray[i].msg);
console.log(friendsArray[i].msg.length);
if(friendsArray[i].id==req.body.fromid)
friendsArray[i].msg.pop();
console.log("friendsArray");
  console.log(friendsArray[i]);
  
  }
   console.log("friendsArray outside");
  console.log(friendsArray);
  let del=[];
  User.findOneAndUpdate({_id:req.params.id},{$set:{"local.friends":friendsArray}},function(err,user){
  if(err){
    console.log("error");
    }
    else
    {
      console.log("deleted waiting msg");
console.log(user);
return res.send({data:user,success:true,message:'deleted waiting msg'});
}
});

}
  });
});
module.exports =router;
