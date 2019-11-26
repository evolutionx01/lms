import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormViewService {
  constructor( 
    private apiService:ApiServiceService
  ) { }
  
  public getCustomers(){
    return this.apiService.get('customer/getallcustomer');
  }

  public getpayerdropdown(data){
   return this.apiService.post('dropDown/getList/', data);
  }
   public getstates(){
     return this.apiService.get('master/states'); 
   }

  public getformtype(data){
    return this.apiService.post('master/formTypes',data); 
  }

  public getformdata(data){
    return this.apiService.post('forms/search/', data);
  }

  public testMultiple(data){
    return this.apiService.post('dropDown/getList/', data);
  }

  public formdelete(data){
    return this.apiService.post('/form/delete/', data);
  }

  public getMasterDropdownData(payer,formType){
    let payer$ =  this.apiService.post('dropDown/getList/', payer);
    let state$ =  this.apiService.get('master/states'); 
    let formType$ = this.apiService.post('master/formTypes',formType);
    return forkJoin([payer$,state$,formType$]);
  }

  public FormEsignStatus(data){
    return this.apiService.post('formBuilder/modifyFormEsignStatus', data);
  }

  public addEsignDimensions(data){
    return this.apiService.post('formBuilder/createEsignDimensions', data);
  }

  public fetchEsignDimensions(data){
    return this.apiService.post('formBuilder/fetchEsignDimensions', data);
  }

  public deleteEsignDimension(data){
    return this.apiService.post('formBuilder/deleteEsignDimension', data);
  }

  public portalEsign(data){
    return this.apiService.post('formBuilder/modifyProviderPortalFormSettingStatus', data);
  }
  public  provider_portal_form(data){
    return this.apiService.post('formTypeSettings/forms', data);
  }

  public formsetting(data){
    return this.apiService.post('formTypeSettings/enableDisableFormSetting', data);
  
  }

  public exportFormList(data){
    return this.apiService.post('forms/export', data);
  }


}