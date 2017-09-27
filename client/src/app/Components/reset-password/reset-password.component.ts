import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { ResetpasswordService } from '../../services/reset-password.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ViewContainerRef } from '@angular/core';
import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    token;
    
    resetForm: FormGroup;
     isHidden =true;
  constructor( private formBuilder: FormBuilder,
          public router: Router ,public route: ActivatedRoute, private ResetpasswordService: ResetpasswordService,
  public toastr: ToastsManager,public vcr: ViewContainerRef) {
      this.createForm(); 
      this.token = route.snapshot.params['id'];
      this.toastr.setRootViewContainerRef(vcr);
      this.token ;
  }

 
  createForm() {
      this.resetForm = this.formBuilder.group({
        
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(35),
          this.validatePassword 
        ])],
        confirm: ['', Validators.required] 
      }, { validator: this.matchingPasswords('password', 'confirm') }); 
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
  
  onResetSubmit() {
      const user = {            
              password: this.resetForm.get('password').value,
              resettoken:this.token
            }
      
      this.ResetpasswordService.savePassword(user).subscribe(data => {
          if (!data.success) {
              this.toastr.error(data.message, 'Oops!');
          } else {
              this.toastr.success(data.message, 'Success!');
            setTimeout(() => {
              this.router.navigate(['/login']); 
            }, 2000);
      }
      });
     
  }
  ngOnInit() {
      
      this.ResetpasswordService.reset(this.token).subscribe(data => {
          if (!data.success) {
              this.toastr.error(data.message, 'Oops!');
             this.isHidden=true;
             setTimeout(() => {
                 this.router.navigate(['/login']); 
               }, 2000);
             
          } else {
              this.toastr.success(data.message, 'Success!');
              this.isHidden=false;
              console.log(data.user);
              data.user.local.resettoken= this.token;
             
      }
      });
}
}