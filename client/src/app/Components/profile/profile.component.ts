import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ChatService } from '../../Services/chat.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

userId;
userName;
userEmail;
onlineStatus;

  constructor(public chatService : ChatService,public route: ActivatedRoute) { }

  ngOnInit() {
  	  this.userId = this.route.snapshot.params['userid'];
  	  console.log(this.userId);
  	  this.chatService.getUser(this.userId).subscribe(userData => {
  	  	console.log(userData.userData.local);
this.userName=userData.userData.local.username;
this.userEmail=userData.userData.local.email;
this.onlineStatus=userData.userData.local.onlineStatus;
  	  });
  }
changeStatus(){
  this.chatService.status(this.userId).subscribe(res => {
    console.log(res);
  });
}
}
