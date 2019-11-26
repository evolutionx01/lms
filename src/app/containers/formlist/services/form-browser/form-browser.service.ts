import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormBrowserService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public getFormBrowserList(params){
    return this.apiService.post('formsinbrowser/search', params);
  }

  public postFormBrowser(params){
    return this.apiService.post('formsinbrowser/add', params);
  }

  public deleteFormBrowser(data){
    return this.apiService.post('form/delete/', data);
  }
  
}
