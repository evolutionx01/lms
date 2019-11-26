import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessPrivilegeViewService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getAccessPrivilegeDetails(params){
    return this.apiService.post('accessPrivileges/customerList',params);
  }

  public getAccessPrivilegeKey(){
    return this.apiService.get('accessPrivileges')
  }

  public accessPrivilegeStatus(dataParams){
    return this.apiService.post('accessPrivileges/create',dataParams)
  }

  public apiAccess(dataParams){
    return this.apiService.post('accessPrivileges/apiAccess',dataParams)
  }

  public apiAccessUpdate(dataParams){
    return this.apiService.post('accessPrivileges/updateApiInfo',dataParams)
  }
  
  
  public apiAccessFetchData(dataParams){
    return this.apiService.post('accessPrivileges/fetchApiInfo',dataParams)
  }
}
