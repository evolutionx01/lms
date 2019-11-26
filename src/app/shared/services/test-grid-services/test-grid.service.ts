import { Injectable } from '@angular/core';
import { ApiServiceService } from '../lms-api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class TestGridService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public uploadPdfFile(postParams){
   return this.apiService.postFile('customer/file_upload',postParams);
  }
  public getCustomers(){
    return this.apiService.get('customer/getallcustomer');
  }
  public getDropdownVal(){
    return this.apiService.get('')
  }
}
