import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormGroupAddService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public postGroupData(params){
    return this.apiService.post('group/create',params)
  }

  public postSubGroupData(params){
    return this.apiService.post('subGroup/create',params)
  }
}
