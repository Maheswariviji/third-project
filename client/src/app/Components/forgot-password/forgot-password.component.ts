import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    forgotForm: FormGroup;

constructor(
  private formBuilder: FormBuilder,
  private forgotPasswordService: ForgotPasswordService,
  public router: Router,
  public toastr: ToastsManager,public vcr: ViewContainerRef
) {
  this.createForm();
  this.toastr.setRootViewContainerRef(vcr);
}
createForm() {
    this.forgotForm = this.formBuilder.group({
      // Email Input
      email: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(5), 
        Validators.maxLength(30), 
        this.validateEmail 
      ])]
    })
}

validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    
    if (regExp.test(controls.value)) {
      return null; 
    } else {
      return { 'validateEmail': true } 
    }
  }


onForgotSubmit() {
    const user = {  
            email: this.forgotForm.get('email').value
          }
         
this.forgotPasswordService.forgot(user).subscribe(data => {
    if (!data.success) {
        this.toastr.error(data.message, 'Oops!');
    } else {
        this.toastr.success(data.message, 'Success!');
      setTimeout(() => {
        this.router.navigate(['/login']); 
      }, 3000);
}
});
}
  ngOnInit() {
  }

}
