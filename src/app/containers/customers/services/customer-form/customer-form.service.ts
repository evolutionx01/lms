import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerFormService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public addCustomerService(postParams){
    return this.apiService.postFile('customer/createuser', postParams);
  }

  public getMasterDeatils(){
    return this.apiService.get('customer/getmasterstate');
  }

  public postEditCustomerDetails(postParams){
    return this.apiService.postFile('customer/edituser', postParams);
  }




  
}
