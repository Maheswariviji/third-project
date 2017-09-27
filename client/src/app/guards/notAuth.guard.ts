import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginAuthService } from '../services/login-auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(
    private authService: LoginAuthService,
    private router: Router
  ) { }

 
  canActivate() {
   
    if (this.authService.loggedIn()) {
      this.router.navigate(['/']); 
      return false; 
    } else {
      return true; 
    }
  }
}