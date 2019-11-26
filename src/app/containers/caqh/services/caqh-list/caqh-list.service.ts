import { Injectable } from '@angular/core';
import { ApiServiceService } from 'src/app/shared/services/lms-api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CaqhListService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getProviderList(postParams){
    return this.apiService.post('customer/getproviders',postParams)
  }

  public getCustomer() {
    return this.apiService.get('dataimport/customerlist');
  }


}
