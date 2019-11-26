import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  setToken(token: string) {
    localStorage.setItem('auth_token', JSON.stringify(token))
    return true;
  }
  getToken() {
    const helper = new JwtHelperService();
    const token = JSON.parse(localStorage.getItem('auth_token'))
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }
  getRawToken() {
    return JSON.parse(localStorage.getItem('auth_token'))
  }
}
