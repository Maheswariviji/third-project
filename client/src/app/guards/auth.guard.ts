import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { LoginAuthService } from '../services/login-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: LoginAuthService,
    private router: Router
  ) { }

 
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
   
    if (this.authService.loggedIn()) {
      return true; 
    } else {
      this.redirectUrl = state.url; 
      this.router.navigate(['/login']); 
      return false; 
    }
  }
}