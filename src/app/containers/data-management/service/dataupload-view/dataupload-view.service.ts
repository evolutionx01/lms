import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatauploadViewService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getCustomerList(postParams) {
    return this.apiService.post('providercreate/getcustomerdropdown', postParams);
  }

  public getTinList(postParams) {
    return this.apiService.post('providercreate/gettindropDown', postParams);
  }

  public getLocationList(postParams) {
    return this.apiService.post('providercreate/getlocationdropdown', postParams);
  }

  public getFormList(postParams) {
    return this.apiService.post('providercreate/getformdropdown', postParams);
  }

  public postCustomForm(postParams) {
    return this.apiService.postFile('providercreate/uploadform', postParams);
  }

  public postCAQHForm(postParams) {
    return this.apiService.postFile('caqh/getfinaldata', postParams)
  }

  public getProviderUpdateCaqh(postParams) {
    return this.apiService.post('caqh/getproviderdropdown', postParams)
  }

  public postUpdateCAQHForm(postParams) {
    return this.apiService.postFile('caqh/updateproviderdata', postParams)
  }

  public forceUpdateCAQHFrom(postParams) {
    return this.apiService.postFile('caqh/updateprovidermismatchdata', postParams);
  }

  public getCaqhListData(postParams) {
    return this.apiService.postFile('caqh/getcaqhlist', postParams);
  }
}
