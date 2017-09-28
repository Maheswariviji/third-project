import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
	private domain = 'http://localhost:8080';  
  	private socket;
  constructor() { }

connectSocket(userId){
   this.socket = io(this.domain);
  this.socket.emit('loggedIn', {
            user: userId
        });
}

    userdata() {
 let observable = new Observable(observer => {
     this.socket=io(this.domain);
      this.socket.on('Userdet', (data) => {
    
        observer.next(data.id);    
         observer.next(data.socketid);  
      });
    
      return () => {
        this.socket.disconnect();
      };  
    })     
return observable;
  } 
        logout(userId){

    this.socket.emit('disconnect');
    
 
     let observable = new Observable(observer => {
     this.socket=io(this.domain);
      this.socket.on('logout-response', (data) => {
          console.log("disconnect response");
        // console.log(data);
        observer.next(data);    
      });
    
      return () => {
        this.socket.disconnect();
      };  
    })     
return observable;
  }
  friendRequest(req)
  {
  
     this.socket=io(this.domain);
 this.socket.emit('friend-request', {req});
 
   
}
ack(){
  let observable = new Observable(observer => {
       this.socket=io(this.domain);
      this.socket.on('friend-data', (data) => {
        console.log("from user data");
        console.log(data);
        observer.next(data);    
      });

      return () => {
        this.socket.disconnect();
      };  
    });     
    return observable;
}
}


