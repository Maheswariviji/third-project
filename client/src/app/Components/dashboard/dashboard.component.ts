import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginAuthService } from '../../services/login-auth.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { AuthGuard } from '../../guards/auth.guard';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPipe } from '../../Pipes/filter.pipe';
import { AuthService } from '../../Services/regAuth.service';
import { ChatService } from '../../Services/chat.service';

import { PushNotificationsService } from 'angular2-notifications'; //import the service

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {SuiCheckboxModule, SuiRatingModule} from 'ng2-semantic-ui';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

mySidenav=false;

  // 
    users =[];
    token;
    user ;
    searchForm: FormGroup;
    userId;
    connection;
    socketId;
    rxdata={};
    socket = null;
      notify;
      friendData ={};
      messageClass;
length;
 name:string;
 username;
 term;
 reqmessage;
 public _opened: boolean = true;
 alertmsg;
 friendrequest=[];
 notification=true;
  content=false;
  friends=false;
  friendsArray=[];
userSocketId;
message ;

offlinemessages = []; 
messages = [];  
   toUserId;
toSocketId;
toUser;
avail;
availability;
newmsg;
newarr=[];

   chatForm: FormGroup;
  constructor( public chatService : ChatService,
    public _pushNotifications: PushNotificationsService,
    public toastr: ToastsManager,
public vcr: ViewContainerRef,
public searchService: AuthService,public router: Router ,private formBuilder: FormBuilder,public route: ActivatedRoute,private authService: LoginAuthService) {
      _pushNotifications.requestPermission();
      this.name = 'sidebar';
      this.socket = io("http://localhost:8080"); 
      this.token = route.snapshot.params[''];
      this.user=route.snapshot.params['user'];
      this.user;
 this.token;
       this.createForm();
       this.Form(); 
       this.toastr.setRootViewContainerRef(vcr);
      
  }
   Form() {
  this.chatForm = this.formBuilder.group({
    chat: ['', Validators.compose([
      Validators.required
    ])],
    }); 
}
  createForm() {
  this.searchForm = this.formBuilder.group({
    search: ['', Validators.compose([
      Validators.required
    ])],
    }); 
}

 
  public _Sidebar() {
    this._opened = !this._opened;
  }

 
  ngOnInit() {
    this.userId = this.route.snapshot.params['userid'];
        this.chatService.getUser(this.userId).subscribe(userData => {
      console.log(userData.userData);
      this.userSocketId=userData.userData.local.socketId;
      
      console.log(userData.userData.local);
console.log(userData.userData.local.friends);
       this.friendsArray=userData.userData.local.friends;
       console.log()
this.offlinemessages=this.friendsArray;
let len=this.friendsArray.length;

console.log(len);
if(len==0){
  console.log("length zero");

             this.messageClass = 'alert alert-dismissible alert-success';
  this.alertmsg="No Friends"; 
 setTimeout(() => {
     this.messageClass='';
   this.alertmsg = ''; 
        
}, 3000);
 }
    
  });
console.log(this.friendrequest);
console.log(this.friendrequest.length);
   if(this.friendrequest.length==0){
    this.notification=false;
     }
     else{
  for(let i=0; i < this.friendrequest.length; i++){
       this.notification=true;
         this.reqmessage = 'alert alert-dismissible alert-info';
   this.friendData=this.friendrequest[i];
         }
     }
   if(this.user){  
      this.authService.storeUserData(this.token, this.user);
      this.router.navigate(['/dashboard']); 
  }

  this.searchService.getfriends().subscribe(data=>{
      console.log(data.user.length);
       for(let i = 0; i< data.user.length; i++){
 if(data.user[i]._id!=this.userId){
this.users.push(data.user[i]);
 }
}
console.log(this.users);

 })
this.socket.on('chatmsg-response',(data)=>
{
  console.log("chatmsg-response");
  console.log(data);
  console.log(data.data);
   console.log(data.data.message);
   if(this.toUserId && this.toUserId == data.data.fromUserId) {
     this.newarr.push(data.data);
                this.messages.push(data.data);
                console.log(this.messages);
                this.chatService.addNewChat(this.newarr).subscribe(data => {
   console.log(data);
                setTimeout( () =>{
                    document.querySelector('.message-thread').scrollTop = document.querySelector('.message-thread').scrollHeight;
                },100);
              
            });

}
this.newarr = [];
})
  
   this.socket.emit('loggedIn', {
            user: this.userId
        });
    this.socket.on('Userdet', (data) => {
      console.log(data);    

    if(data.w_array)
 {
console.log(data.w_array.length);
this.chatService.getUser(this.userId).subscribe(details => {
                console.log(details.name);
            console.log(details.userData);
             console.log(details.userData.local.onlineStatus);
             if(details.userData.local.onlineStatus=='Y'){
       
               this.avail = 'label label-danger'; // Set error bootstrap class
        this.availability = 'glyphicon glyphicon-ok';

             }
             else{

               this.avail = 'label label-warning'; // Set error bootstrap class
        this.availability = 'glyphicon glyphicon-remove';
             }
             console.log(details.userData);
                this.username=details.name;

      this.socketId=details.details;
    });
for(let i = 0; i< data.w_array.length; i++){
  this.friendrequest.push(data.w_array[i]);
     }

     if(this.friendrequest.length==0 || this.friendrequest.length>0){
       this.notification=true;
    this.reqmessage = 'alert alert-dismissible alert-info';
 console.log(this.friendrequest);
     }
 }else{
console.log("notification");
      if (data.message=="online") {
this.chatService.getUser(this.userId).subscribe(details => {
   console.log(details.userData.local.onlineStatus);
    if(details.userData.local.onlineStatus=='Y'){
               
               this.avail = 'label label-danger'; // Set error bootstrap class
        this.availability = 'glyphicon glyphicon-ok';
             }
             else{

               this.avail = 'label label-warning'; // Set error bootstrap class
        this.availability = 'glyphicon glyphicon-remove';
             }
                console.log(details.name);
            console.log(details.details);
                this.username=details.name;
      this.socketId=details.details;
    });
    }
 }
});
     

         this.socket.on('Accept-response',(data)=>{
console.log(data.Acceptdata);
this.messageClass = 'alert alert-dismissible alert-success';
  this.alertmsg= data.Acceptdata.name + "    " +data.Acceptdata.message + "!!!"; 
   setTimeout(() => {
     this.messageClass='';
   this.alertmsg = ''; 
}, 1000);
   });
     this.socket.on('friend-response',(data)=>
 {
   console.log("friend Reponse");
   console.log(data);
   if(this.friendrequest.length==0){
this.friendrequest.push(data);
     console.log("push");
      this.notification=true;
        this.reqmessage = 'alert alert-dismissible alert-info';

   }
   else{
       for(let i = 0; i< this.friendrequest.length; i++){
 if(this.friendrequest[i].id==data.id){
    console.log("already requested");
     }
     else{
       if(this.friendrequest.indexOf(data) === -1)  {
     this.friendrequest.push(data);
     console.log("push");
      this.notification=true;
        this.reqmessage = 'alert alert-dismissible alert-info';

       }
     }
    }
   }
 })

     this.socket.on('msg', (data) => {
        console.log("waiting msg");
      console.log(data); 
    });


     }


add(d){
  console.log(d);
    console.log(d.id);
 
  this.chatService.getUser(d.id).subscribe(data => {
                console.log(data.name);
            console.log(data.details);
      d.fromsocketid=data.details;
      console.log(d.fromsocketid);
    });
  const da={
    toId:this.userId,
    id:d.id,
    name:d.name,
    emailid:d.emailid
  };
   this.chatService.Addfriend(da).subscribe(data => {
      console.log(data);
        console.log(data.info);
        const details=data.info;
  
if(data.success){
this.chatService.reqFriend(details).subscribe(data => {
      console.log(data);
      if(data.success){ 
  const req1={
    name:details.name,
    sid:d.fromsocketid
  }
  this.socket.emit('Accept-request', {req1}); 
     for(let i = 0; i< this.friendrequest.length; i++){
 if(this.friendrequest[i].id==d.id){
        this.friendrequest.splice(i,1); 
     console.log(this.friendrequest);

 }
}
}
});

}
else{
  let socketid=d.fromsocketid;
console.log("not accepted");
}
});

}
addfriend(u){
  console.log(u);


this.chatService.getUser(this.userId).subscribe(data => {
      console.log(data.userData);

            console.log(data.userData.local);
console.log(data.userData.local.friends);
       this.friendsArray=data.userData.local.friends;
let len=this.friendsArray.length;
console.log(len);
if(len==0){
  console.log("length zero");
 const req = {
            fromid: this.userId,
         toid: u._id ,
         fromsocketid:this.socketId
       }
             this.messageClass = 'alert alert-dismissible alert-success';
  this.alertmsg="Send Friend Request"; 
 setTimeout(() => {
     this.messageClass='';
   this.alertmsg = ''; 
          this.searchForm.reset();
}, 1000);

    this.socket.emit('friend-request', {req}); 

      }
      else
      {
          console.log("length is greater than zero");
          console.log(len);
          console.log(this.friendsArray);
          for(let i = 0; i< len; i++){
 if(this.friendsArray[i].id==u._id){
  console.log("Already Friend");
  console.log(this.friendsArray[i]);
 console.log(data);
                  this.messageClass = 'alert alert-dismissible alert-success';
  this.alertmsg="Already Friend"; 
 setTimeout(() => {
     this.messageClass='';
   this.alertmsg = ''; 
          this.searchForm.reset();
}, 3000);
 }
}
      }
  });
  
}

logout(){
   this.authService.logout(); 
   this.chatService.logout(this.userId).subscribe(data => {
      console.log(data);
        this.toastr.success("Successfully Logout", 'Success!');
this.router.navigate(['/login']); 
 window.location.reload(); 


     });
 
}
profile(){
  this.searchForm.reset();
  this.content=true;
  this.friends=false;
}
friendlist(){
    this.searchForm.reset();
  this.friends=true;
  this.content=false;
}


changeStatus(){
  this.chatService.status(this.userId).subscribe(res => {
    console.log(res);
    if(res.status){
       
          
               this.avail = 'label label-danger'; 
        this.availability = 'glyphicon glyphicon-ok';
    }
    else{
      
               this.avail = 'label label-warning'; 
        this.availability = 'glyphicon glyphicon-remove';
    }
  });
}
alignMessage(userId){
    return this.userId ===  userId ? false : true;
  }
  selectedUser(user){
    console.log(user.id);
    this.chatService.getUser(user.id).subscribe(userData => {
      console.log(userData.userData.local.friends);
      this.toUserId=user.id;
      this.toUser=userData.userData.local.username;
      this.toSocketId=userData.userData.local.socketId;
     console.log(this.offlinemessages);
     console.log(this.offlinemessages.length);
              for(let i = 0; i< this.offlinemessages.length; i++){
 if(this.offlinemessages[i].id==user.id){
   this.messages=this.offlinemessages[i].msg;
   }

 }
 if(this.messages.length>0){
      this.delmsg(this.messages,user.id);
    }
 });


  }
  delmsg(m,id){
    console.log(m)
   this.chatService.addNewChat(m).subscribe(data => {
   console.log(data);
   if(data.success){
     console.log(this.userId)
     const data={id:this.userId,fromid:id};
     this.chatService.delmsg(data).subscribe(docs => {
console.log(docs);
   });
   }
   else{
     console.log("error while saving chat message");
   }
   
 });

  }
  remove(){}
    sendMessage(newmsg){
                   let currentTime = new Date()
  let month = currentTime.getMonth() + 1
let day = currentTime.getDate()
let year = currentTime.getFullYear()
let cvalue=day + "/" + month + "/" + year;
console.log(cvalue);
let currentdate = new Date();
let datetime =   currentdate.getHours() + ":" + currentdate.getMinutes();
console.log(datetime);
  let dt= cvalue + " "+ datetime;
          console.log(dt);
      console.log(newmsg);
      if(this.userId == '' ){
          this.router.navigate(['/login']);          
        }

      else{

       if(this.newmsg == '' || this.newmsg == null) {
       this.messageClass = 'alert alert-dismissible alert-danger';
  this.alertmsg="Message cant be empty."; 
    setTimeout(() => {
     this.messageClass='';
   this.alertmsg = ''; 
        
}, 3000);
      }
        else{
         if(this.toUserId == '' || this.toUserId == null ||this.toUserId == undefined){
           console.log("Select a user to chat.")
             this.messageClass = 'alert alert-dismissible alert-danger';
  this.alertmsg="Select a user to chat."; 
  setTimeout(() => {
     this.messageClass='';
   this.alertmsg = ''; 
}, 3000);
        }
         else{

if(this.toSocketId== '' || this.toSocketId == null ||this.toSocketId == undefined){
const data = {
            fromUserId : this.userId,
            message : (this.newmsg).trim(),
            toUserId : this.toUserId,
            fromSocketId : this.userSocketId,
            fromUserName:this.username,
            toUserName:this.toUser
          }
          this.messages.push(data);
          console.log(this.messages);
          console.log(this.messages);
        
          const msg={
            fromUserId : this.userId,
            message : (this.newmsg).trim(),
            toUserId : this.toUserId,
            fromSocketId : this.userSocketId,
            date: dt,
            fromUserName:this.username,
            toUserName:this.toUser
          }
          console.log(msg);
          this.newmsg = null;
 this.chatService.addChat(msg).subscribe(data=>{
   console.log("after adding msg to friend array");
   console.log(data);
 })

}
else{
   const data = {
            fromUserId : this.userId,
            message : (this.newmsg).trim(),
            toUserId : this.toUserId,
            toSocketId : this.toSocketId,
            fromSocketId : this.userSocketId,
            fromUserName:this.username,
            toUserName:this.toUser,
             date: dt,
          }
          this.messages.push(data);
          setTimeout( () =>{
                document.querySelector('.message-thread').scrollTop = document.querySelector('.message-thread').scrollHeight;
            },100);
          this.newmsg = null;
          
   this.socket.emit('chatmsg', {
            data
        });
}
       
        }
      }
       
      }
     
    }
}