import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {
domain="http://localhost:8080";
  constructor(public http:Http) { }

    userSessionCheck(userId){
   return this.http.post(this.domain + '/reg/userSessionCheck', userId).map(res => res.json());
}
logout(userId)
{
	 return this.http.put(this.domain + '/reg/update/'+ userId , userId).map(res => res.json());
}
getUser(userId){
	return this.http.get(this.domain + '/reg/getuser/' + userId).map(res => res.json());
}
Addfriend(d){
	 return this.http.put(this.domain + '/reg/addFriend/'+ d.id , d).map(res => res.json());
}
reqFriend(details){
	console.log(details);
	console.log(details.id);
	 return this.http.put(this.domain + '/reg/reqFriend/'+ details.id , details).map(res => res.json());
}
checkFriend(u){
	return this.http.get(this.domain + '/reg/checkFriend/' + u.fromid ,u).map(res => res.json());
}
status(user){
	console.log(user);
    return this.http.put(this.domain + '/reg/status/'+ user,user).map(res => res.json());
}
 addChat(messages) {
 	console.log()
    return this.http.put(this.domain + '/reg/waitmsg/'+ messages.toUserId,messages).map(res => res.json());
  }
  addNewChat(msg){
  	return this.http.post(this.domain + '/reg/addmsg', msg).map(res => res.json());
  }
delmsg(data){
	console.log(data);
    return this.http.put(this.domain + '/reg/deletemsg/' + data.id,data).map(res => res.json());
}

}
