import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {AuthService} from '../../Services/regAuth.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ViewContainerRef} from '@angular/core';
import { LoginAuthService } from '../../services/login-auth.service';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
domain="http://localhost:8080";
    registerForm: FormGroup;
emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  message;
  messageClass;
  processing = false;
    emailClass;
  usernameclass;
  previousUrl;

constructor(
  private formBuilder: FormBuilder,
public router: Router,
private authGuard: AuthGuard,
private loginAuthService: LoginAuthService,
public authService: AuthService,public toastr: ToastsManager,
public vcr: ViewContainerRef
) {
  this.createForm(); 
   this.toastr.setRootViewContainerRef(vcr);
}
createForm() {
  this.registerForm = this.formBuilder.group({
    email: ['', Validators.compose([
      Validators.required, 
      Validators.minLength(5), 
      Validators.maxLength(30), 
      this.validateEmail 
    ])],
    username: ['', Validators.compose([
      Validators.required,
      Validators.minLength(3), 
      Validators.maxLength(15), 
      this.validateUsername 
    ])],
    password: ['', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(35),
      this.validatePassword 
    ])],
    confirm: ['', Validators.required] 
  }, { validator: this.matchingPasswords('password', 'confirm') }); 
}

validateEmail(controls) {
  const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if (regExp.test(controls.value)) {
    return null; 
  } else {
    return { 'validateEmail': true } 
  }
}

validateUsername(controls) {
  const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
  if (regExp.test(controls.value)) {
    return null; 
  } else {
    return { 'validateUsername': true } 
  }
}


validatePassword(controls) {  
  const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
  if (regExp.test(controls.value)) {
    return null; 
  } else {
    return { 'validatePassword': true } 
  }
}


matchingPasswords(password, confirm) {
  return (group: FormGroup) => {
   
    if (group.controls[password].value === group.controls[confirm].value) {
      return null; 
    } else {
      return { 'matchingPasswords': true } 
    }
  }
}


onRegisterSubmit() {
   console.log("form submitted");
    const user = {
            username: this.registerForm.get('username').value,
            email: this.registerForm.get('email').value, 
            password: this.registerForm.get('password').value
          }
          console.log(user);
this.authService.registerUser(user).subscribe(data => {

  if (!data.success) {
            this.toastr.error(data.message, 'Oops!');
        } else {
            this.toastr.success(data.message, 'Success!');
            console.log(data);
          this.loginAuthService.storeUserData(data.token, data.user);
          console.log(data.user.id);
        
          setTimeout(() => {
              if (this.previousUrl) {
                  this.router.navigate([this.previousUrl]); 
      } else{
            
             this.router.navigate(['/dashboard/'+data.user.id]);
      }        }, 2000);
}

});
}

checkEmail() {
   
    this.authService.checkEmail(this.registerForm.get('email').value).subscribe(data => {
     if (!data.success) {
        this.emailValid = false; 
        this.emailMessage = data.message; 
        this.emailClass='alert alert-danger';
      } else {
        this.emailValid = true; 
        this.emailMessage = data.message; 
         this.emailClass='alert alert-success';
      }
    });
  }

  checkUsername() {
   this.authService.checkUsername(this.registerForm.get('username').value).subscribe(data => {
     if (!data.success) {
        this.usernameValid = false; 
        this.usernameMessage = data.message; 
        this.usernameclass='alert alert-danger';
      } else {
        this.usernameValid = true; 
        this.usernameMessage = data.message; 
         this.usernameclass='alert alert-success';
      }
    });
  }
  

ngOnInit() {
   if (this.authGuard.redirectUrl) {
          this.toastr.error('You must be logged in to view that page.', 'Oops!'); 
          this.previousUrl = this.authGuard.redirectUrl; 
          this.authGuard.redirectUrl = undefined; 
  }
}

}