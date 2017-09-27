import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ResetpasswordService {

    domain = "http://localhost:8080"; 
    constructor(private http: Http) { }
   
    reset(token) {
        
        return this.http.get(this.domain + '/forgotPasswordAuthentication/resetpassword/'+token).map(res => res.json());
      }
    savePassword(user) {
        return this.http.put(this.domain + '/forgotPasswordAuthentication/savepassword',user).map(res => res.json());
      }
  }
