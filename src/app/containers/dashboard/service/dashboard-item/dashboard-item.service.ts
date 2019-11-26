import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardItemService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public getListOfActiveUsers(params){
    return this.apiService.post('cmdanalytics/getactiveusers',params);
  }

  public getListOfMostVisitedPages(params){
    return this.apiService.post('analytics/getanalytics','');
  }

  public getListOfCustomer(params){
    return this.apiService.post('dashboard/customerlist', params);
  }

  public getAnalytics(){
    return this.apiService.get('dashboard/customerstats');
  }

  public getLoginHistory(params){
    return this.apiService.post('dashboard/loginhistory', params);
  }

  public exportExcelHistory(params){
    return this.apiService.post('dashboard/loginhistorysheet', params);
  }
  
  // public getAnalytics(postParams){

  //   let analyticsData =  this.apiService.get('dashboard/customerstats');
  //   let customerData =  this.apiService.post('dashboard/customerlist',postParams);

  //   return forkJoin([analyticsData,customerData]);
  // }


  public getListOfUsers(params){
    return this.apiService.post('dashboard/userlist', params);
  }


}
