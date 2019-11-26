import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsersviewService {

  constructor(
    private apiService:ApiServiceService
  ) { }
  public getUsers(data){
    return this.apiService.post('user/getlmsuserlist',data);
  }

  public getmasterstates(){
    return this.apiService.get('customer/getmasterstate');
  }

  public getuserrole(){
    return this.apiService.get('user/getuserrole');
  }

  public adduser(data){
    return this.apiService.post('user/create',data);
  }
  
  public edituser(data){
    return this.apiService.post('user/get',data);
  }

  public updateuser(data){
    return this.apiService.post('user/update',data);
  }

  public userdelete(data){
    return this.apiService.post('user/activatedeactivate',data);
  }

  public getuserroledetails(data){
    return this.apiService.post('role/getuserrole',data);
  }

  public adduserrole(data){
    return this.apiService.post('role/create',data);
  }

  public edituserrole(data){
    return this.apiService.post('role/getroledetail',data);
  } 

  public updateuserrole(data){
    return this.apiService.post('role/update',data);
  } 

  // export excel

  public exportUserList(postParams){
    return this.apiService.post('user/getuserexcel',postParams);
  }
 
}
