import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  public authToken;
  private isAuthenticated = true; // Set this value dynamically
  
  constructor(private router: Router, public auth: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.isAuthenticated = this.auth.isLoggedIn() ? true : false;
    if (this.isAuthenticated) {
      return true;
    }
    this.router.navigate(['']);
    return false;
   // return true;
  }

//   getCurrentUser(){
//     return JSON.parse(localStorage.getItem('user')) || {};
//   }

}