import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormSubgroupViewService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public getSubGroupData(params){
    return this.apiService.post('subGroup/list',params)
  }

  public deleteFromSubGroupData(params){
    return this.apiService.post('subGroup/delete',params)
  }

  public getListOfFields(params){
    return this.apiService.post('formField/list',params)
  }

  public deleteFormField(params){
    return this.apiService.post('formField/delete', params)
  }

  public exportSubgroupList(params){
    return this.apiService.post('subGroup/export', params)
  } 

  public exportFieldsList(params){
    return this.apiService.post('formField/export', params)
  } 
  


}
