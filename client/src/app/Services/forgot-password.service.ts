import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ForgotPasswordService {
    domain = "http://localhost:8080"; 
  constructor(private http: Http) { }

 forgot(user) {
      return this.http.put(this.domain + '/forgotPasswordAuthentication/resetpassword', user).map(res => res.json());
    }
}
