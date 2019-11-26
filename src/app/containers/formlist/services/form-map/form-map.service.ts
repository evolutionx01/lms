import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormMapService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getFormList(params) {
    return this.apiService.post('formBuilder/formFields', params);
  }

  public getbaseurl(params){
    return this.apiService.post('/formBuilder/getformpreview', params);
  }
  
  

  public postUnmapFields(params) {
    return this.apiService.post('formBuilder/mapFormFields', params);
  }

  public postPublishForm(params) {
    return this.apiService.post('form/publish', params);
  }

  public getMappedFieldData(params) {
    return this.apiService.post('formBuilder/fetchMappedFieldGroupData', params);
  }
  
}
