import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ChatService } from '../../Services/chat.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
userId;
 friendsArray=[];
       messageClass;
 alertmsg;
 userSocketId;
message ;

offlinemessages = []; 
messages = [];  
   toUserId;
toSocketId;
toUser;
   socket = null;
      chatForm: FormGroup;
  constructor(public chatService : ChatService,private formBuilder: FormBuilder,public route: ActivatedRoute,public router: Router) {   this.createForm(); 
  this.socket = io("http://localhost:8080"); 
}
  createForm() {
  this.chatForm = this.formBuilder.group({
    chat: ['', Validators.compose([
      Validators.required
    ])],
    }); 
}

  ngOnInit() {
  	 this.userId = this.route.snapshot.params['userid'];
  	  console.log(this.userId);
  	  this.chatService.getUser(this.userId).subscribe(userData => {
      console.log(userData.userData);
      this.userSocketId=userData.userData.local.socketId;
      
      console.log(userData.userData.local);
console.log(userData.userData.local.friends);
       this.friendsArray=userData.userData.local.friends;
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
      this.socket.on('msg', (data) => {
        console.log("waiting msg");
      console.log(data); 
    });

  }

  alignMessage(userId){
    return this.userId ===  userId ? false : true;
  }
  selectedUser(user){
    console.log(user.id);
    this.chatService.getUser(user.id).subscribe(userData => {
      console.log(userData.userData);
      this.toUserId=user.id;
      this.toUser=userData.userData.local.username;
      this.toSocketId=userData.userData.local.socketId;

    });
  }
  remove(){}
    sendMessage(message){
                   let currentTime = new Date()
  let month = currentTime.getMonth() + 1
let day = currentTime.getDate()
let year = currentTime.getFullYear()
let cvalue=day + "/" + month + "/" + year;
console.log(cvalue);
let currentdate = new Date();
let datetime =   currentdate.getHours() + ":" + currentdate.getMinutes();
console.log(datetime);
      console.log(message);
      if(this.message == '' || this.message == null) {
       this.messageClass = 'alert alert-dismissible alert-danger';
  this.alertmsg="Message cant be empty."; 
    setTimeout(() => {
     this.messageClass='';
   this.alertmsg = ''; 
        
}, 3000);
      }else{

       if(this.userId == '' ){
          this.router.navigate(['/login']);          
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
            message : (this.message).trim(),
            toUserId : this.toUserId,
            fromSocketId : this.userSocketId 
          }
          this.messages.push(data);
          console.log(this.messages);
          console.log(this.messages);
          let dt= cvalue + " "+ datetime;
          console.log(dt);
          const msg={
            fromUserId : this.userId,
            message : (this.message).trim(),
            toUserId : this.toUserId,
            fromSocketId : this.userSocketId,
            date: dt
          }
          console.log(msg);
          this.message = null;
 this.chatService.addChat(msg).subscribe(data=>{
   console.log(data);
 })

}
else{

}
          const data = {
            fromUserId : this.userId,
            message : (this.message).trim(),
            toUserId : this.toUserId,
            toSocketId : this.toSocketId,
            fromSocketId : this.userSocketId
          }
          this.messages.push(data);
          setTimeout( () =>{
                document.querySelector('.message-thread').scrollTop = document.querySelector('.message-thread').scrollHeight;
            },100);
          this.message = null;
          // this.socketService.sendMessage(data);
        }
      }
       
      }
    }
  }


