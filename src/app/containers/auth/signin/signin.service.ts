import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../shared/services/lms-api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  constructor(private apiService:ApiServiceService) { }
  
  public login(postParams){
      return this.apiService.post('user/login',postParams);
  } 

  public otpValidation(postParams){
    return this.apiService.post('user/verifyotp',postParams)
  }

  public resendOtp(postParams){
    return this.apiService.post('user/resendotp',postParams)
  }
}
