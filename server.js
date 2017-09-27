const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan=require('morgan');
const router = express.Router();
const mongoose=require('mongoose');
const config =require('./config/database');
const path=require('path');
const loginAuth = require('./routes/loginAuthentication')(router);
const forgotAuth = require('./routes/forgotPasswordAuthentication');
const cors = require('cors');
const passport = require('passport');
const Register=require('./routes/userAuthentication');
const socialAuth=require('./routes/socialAuthentication');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./model/user'); 
const http = require('http').Server(app);
const io = require('socket.io')(http);

let friendsArray=[];
let w_array=[];
let reqdata={};
let status;
let toId,fromId;
let onlinereq=[];
let arr=[];
let msgs=[]
mongoose.Promise=global.Promise;
mongoose.connect(config.uri,(err)=>{
	if(err){
		console.log('cannot connect to database');
		
	}else{
		console.log('database sucessfully connected');
	}
		
});

app.use(cors({
	origin:'http://localhost:4200'
}));


io.on('connection', (socket) => {

    console.log('user connected');
     console.log(socket.id);
     socket.on('chatmsg',function(data){
 console.log("chatmsg");
 console.log(data);
 console.log(data.data);
 console.log(data.data.toSocketId);
  let chatid=data.data.toSocketId;
   socket.to(chatid).emit('chatmsg-response',{data:data.data});
     });
 socket.on('Accept-request',function(data){
      console.log("Accept-request");
     console.log(data);
     console.log(data.req1.name);
     console.log(data.req1.sid);
      let socketid=data.req1.sid;
      const Acceptdata={name:data.req1.name,message:'Accepted Request'}
console.log(Acceptdata);
      socket.to(socketid).emit('Accept-response',{Acceptdata});

     })

     socket.on('loggedIn', function(data) {
   console.log("logged In");
                console.log(socket.id);
                let soid=socket.id;
        User.findOneAndUpdate({
            _id: data.user
        },{$set:{"local.onlineStatus":'Y',"local.socketId":soid}},function(err, user) {
            if (err) {
                res.json(err);
            } else {
  console.log('socket data Added');
                console.log(user);
                console.log("waiting msg");
console.log(user.local.waitingMsg);
msgs=user.local.waitingMsg
console.log(user.local.waitingMsg.length);

  if(msgs.length==0){
    console.log("msg is zero");
                    console.log("waiting list");
console.log(user.local.waitingList);
 const id=user._id;
  w_array=user.local.waitingList;
  if(w_array.length==0){
    io.emit('Userdet',{
              id,message:"online"
             });
  }
    else{
       io.to(soid).emit('Userdet',{
              id,message:"online",w_array
             });
    }
  }
  else
  {
    console.log("msg is greater than zero");
    console.log(msgs);
 io.to(soid).emit('msg',{
              msgs
             });
                  console.log("waiting list");
console.log(user.local.waitingList);
 const id=user._id;
  w_array=user.local.waitingList;
  if(w_array.length==0){
    io.emit('Userdet',{
              id,message:"online"
             });
  }
    else{
       io.to(soid).emit('Userdet',{
              id,message:"online",w_array
             });
    }

  }
                console.log("waiting msg comple");

            }
        });
    });
 
      socket.on('disconnect',()=>{
        console.log("disconnect called");
      	console.log(socket.id);
          io.emit('logout-response'); 
  });
      socket.on('friend-request',(data)=>{
        console.log('friend-request');
        console.log(data);
         fromId=data.req.fromid;
          toId=data.req.toid;
          const fromsocketid=data.req.fromsocketid;
 console.log(fromsocketid);
         User.findOne({
            _id: toId
        }, function(err, user) {
            if (err) {
                res.json(err);
            } else {
                console.log('requested friend data');
              console.log(user.local.friends);
              friendsArray=user.local.friends;
let len=friendsArray.length;
console.log(len);
console.log(user.local.onlineStatus);
status=user.local.onlineStatus;
if(len==0 || len>0){

  if(status=='Y'){
    console.log("online");
    console.log(user.local.socketId);
    let sid=user.local.socketId;
    User.findOne({
            _id: fromId
        }, function(err, data) {
            if (err) {
                res.json(err);
            } else {
console.log("from user details");

reqdata=data;
const details = {
            id: reqdata._id,
            name:reqdata.local.username,
            emailid:reqdata.local.email,
            toId:toId,
            fromsocketid:fromsocketid
          }
       console.log("friend-response");
          console.log(details);
          console.log(sid);
   
     socket.to(sid).emit('friend-response',details);
     console.log("details end");
    } 
      });      }
    else
    {
      console.log("not online");
          User.findOne({
            _id: fromId
        }, function(err, data) {
            if (err) {
                res.json(err);
            } else {
console.log("from user details");
console.log(data);
reqdata=data;
       console.log(user.local.waitingList);
       w_array=user.local.waitingList;
let w_len=w_array.length;
console.log(w_len);
console.log(reqdata);
const details = {
            id: reqdata._id,
            name:reqdata.local.username,
            emailid:reqdata.local.email
          }
          console.log(details);
w_array.push(details);
console.log(w_array);
User.findOneAndUpdate({_id:toId},{$set:{"local.waitingList":w_array}},function(err,docs){
  if(err){
    console.log("error");
    }
    else
    {
console.log(docs);
    }
  });
}
});
}

}
}
 });
      });

});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}));
app.use(express.static(__dirname+'/client/dist/'));
app.use('/loginAuthentication', loginAuth);
app.use('/forgotPasswordAuthentication', forgotAuth);
app.use('/socialAuthentication',socialAuth);
app.use('/reg',Register);

app.use(passport.initialize());
app.use(passport.session());


app.get('/twitter/return',socialAuth);
app.get('/auth/google/callback',socialAuth);
app.get('/auth/facebook/callback',socialAuth);
app.get('/auth/linkedin/callback',socialAuth);
app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname+'/client/dist/index.html'));
});

http.listen(8080,()=> {
	console.log('Listening on port 8080');
});