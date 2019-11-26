import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {

  constructor(
   // private apiService: ApiService,
  ) { }

  isLoggedIn(): Boolean  {
   const helper = new JwtHelperService();
    let token = localStorage.getItem('auth_token');
    let tokenExpired = helper.isTokenExpired(token) ? true : false;
    return (token && !tokenExpired) ? true : false;
  }

}
