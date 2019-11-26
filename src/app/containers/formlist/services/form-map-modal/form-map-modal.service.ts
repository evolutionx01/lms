import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormMapModalService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public getDropdownGroupData(params){
    return this.apiService.post('group/list',params)
  }

  public getDropdownSubGroupData(params){
    return this.apiService.post('subGroup/list',params);
  }

  public getFormFieldsToMapData(params){
    return this.apiService.post('formBuilder/searchFormFields',params)
  }

  public mapFormField(params){
    return this.apiService.post('formBuilder/mapFormFields', params)
  }
  public fetchmultiplelocations(){
    return this.apiService.get('formBuilder/fetchMultipleLocations')
  }
 
}
