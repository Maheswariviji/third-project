import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {


domain="http://localhost:8080";


  constructor(public http:Http) { }

   registerUser(user) {
    return this.http.post(this.domain + '/reg/registerauth', user).map(res => res.json());
  }

  checkUsername(username) {
    return this.http.get(this.domain + '/reg/checkUsername/' + username).map(res => res.json());
  }

 
  checkEmail(email) {
    return this.http.get(this.domain + '/reg/checkEmail/' + email).map(res => res.json());
  }
getfriends(){ 
   return this.http.get(this.domain + '/reg/search').map(res => res.json());
    }
    
}
