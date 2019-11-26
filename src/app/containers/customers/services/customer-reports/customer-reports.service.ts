import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerReportsService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getCannedReportDetails(postParams){
    return this.apiService.post('cannedReport/listByCustomer', postParams);
  }

  public getIpaReportDetails(postParams){
    return this.apiService.post('ipaReport/list', postParams);
  }

  public getIpaReportStatus(postParams){
    return this.apiService.post('ipaReport/create', postParams);
  }

  public getCustomerList(){
    return this.apiService.get('cannedReport/customers');
  }

  public getCannedReportStatus(postParams){
    return this.apiService.post('cannedReport/create', postParams);
  }

}
