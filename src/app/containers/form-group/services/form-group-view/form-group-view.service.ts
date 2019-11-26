import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormGroupViewService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public getFormGroupData(params){
    return this.apiService.post('group/list',params)
  }

  public deleteFromGroupData(params){
    return this.apiService.post('group/delete',params)
  }

  
  public exportFormGroup(params){
    return this.apiService.post('group/export',params)
  }
}
