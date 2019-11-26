import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropdownViewService {
  
  constructor(
    private apiService:ApiServiceService
  ) { }

  public getDropdownList(params){
    return this.apiService.post('dropDown/dropDownDisplay',params);
  }

  public addDropdownDetails(params){
    return this.apiService.post('dropDown/create',params);
  }

  public getDropdownEditDetails(params){
    return this.apiService.post('dropDown/details',params);
  }

  public addDropdownEditItem(params){
    return this.apiService.post('dropDown/createItem',params)
  }

  public editDropdownEditItem(params){
    return this.apiService.post('dropDown/createItem',params)
  }

  public exportDropdown(params){
    return this.apiService.post('dropDownItems/export',params)
  }

}
