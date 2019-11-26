import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomerViewService {
  public getMultArr: Array<object>;
  constructor( 
    private apiService:ApiServiceService
  ) { }
  
  // public getCustomers(){
  //   return this.apiService.get('customer/getmasterstate');
  // }
  
  public getCustomerList(postParams){
    return this.apiService.post('customer/getcustomerlist', postParams);
  }

  public deleteCustomer(postParams){
    return this.apiService.post('customer/delete', postParams);
  }

  public getEditCustomerDetails(postParams){

    let editData =  this.apiService.post('customer/getuserdetails',postParams);
    let licData =  this.apiService.post('license/getcustomerlicenseinfo',postParams);

    return forkJoin([editData,licData]);
  }

  public exportExcel(postParams){
    return this.apiService.post('customer/customerlistexcel', postParams);
  }

}
