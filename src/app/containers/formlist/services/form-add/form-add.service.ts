import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormAddService {

  constructor(
    private apiService:ApiServiceService
  ) { }
  public getCustomers(){
    return this.apiService.get('customer/getallcustomer');
  }

  public getpayerdropdown(data){
   return this.apiService.post('dropDown/getList/', data);
  }

  public getstates(){
    return this.apiService.get('master/states'); 
  }
  
  public getformtype(data){
    return this.apiService.post('master/formTypes',data); 
  }

  public addformdetails(data){
    return this.apiService.postFile('forms/add',data);
  }

  public uploadPdfFile(postParams){
    return this.apiService.postFile('customer/file_upload',postParams);
   }

   public showform_details(data) {
   return this.apiService.post('form/details',data);
   }

  


}
