import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class LoginAuthService {

  domain = "http://localhost:8080"; 
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }
  
 
  createAuthenticationHeaders() {
    this.loadToken(); 
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', 
        'authorization': this.authToken 
      })
    });
  }

  
  loadToken() {
    this.authToken = localStorage.getItem('token');;
  }


 
  login(user) {
    return this.http.post(this.domain + '/loginAuthentication/login', user).map(res => res.json());
  }


  logout() {
    this.authToken = null;
    this.user = null; 
    localStorage.clear(); 
  }

 
  storeUserData(token, user) {
    localStorage.setItem('token', token); 
    localStorage.setItem('user', JSON.stringify(user)); 
    this.authToken = token; 
    this.user = user;
  }

 
  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/loginAuthentication/profile', this.options).map(res => res.json());
  }
  

  loggedIn() {
    return tokenNotExpired();
  }

  checkEmailForLogin(email) {
      return this.http.get(this.domain + '/reg/checkEmailForLogin/' + email).map(res => res.json());
    }
}