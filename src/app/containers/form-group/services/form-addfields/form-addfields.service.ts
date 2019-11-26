import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormAddfieldsService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public getMasterDropDown(){
    return this.apiService.get('master/fieldTypes');
  }

  public addFieldData(params){
    return this.apiService.post('formField/create',params)
  }

  public getEditFormFileds(params){
    return this.apiService.post('formField/details',params)
  }

  public getDropdownDetails(params){
    return this.apiService.post('dropDown/dropDownDisplay',params)
  }
}
