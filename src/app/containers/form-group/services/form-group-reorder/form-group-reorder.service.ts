import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormGroupReorderService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public postReorderFormGroup(params){
    return this.apiService.post('group/reorder',params)
  }

  public postReorderFormSubGroup(params){
    return this.apiService.post('subGroup/reorder',params)
  }
  public postReorderFormFields(params){
    return this.apiService.post('formField/reorder',params)
  }

}
