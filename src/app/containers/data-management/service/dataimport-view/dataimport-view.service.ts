import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataimportViewService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getCustomer() {
    return this.apiService.get('dataimport/customerlist');
  }

  public postDownloadTemplate(postParams) {
    return this.apiService.post('dataimport/providertemplate', postParams);
  }

  public getCustomerList(postParams) {
    return this.apiService.post('providercreate/getcustomerdropdown', postParams);
  }

  public getTinList(postParams) {
    return this.apiService.post('providercreate/gettindropDown', postParams);
  }

  public getLocationList(postParams) {
    return this.apiService.post('providercreate/getlocationdropdown', postParams);
  }

  public uploadStandardTemplate(postParams){
    return this.apiService.postFile('providercreate/uploadform', postParams);
  }

  public downloadTIN(){
    return this.apiService.get('dataimporttin/tintemplate');
  }

  public uploadTIN(postParams){
    return this.apiService.postFile('dataimporttin/tintemplateimport', postParams);
  }

  public downloadProviderPayer(postParams){
    return this.apiService.post('dataimport/providerpayertemplate', postParams)
  }

  public uploadProviderPayer(postParams){
    return this.apiService.postFile('dataimport/providerPayerImport', postParams);
  }

  public downloadProvider(){
    return this.apiService.get('dataimport/providertemplate')
  }

  public uploadProvider(postParams){
    return this.apiService.postFile('dataimport/importprovider', postParams);
  }

  public downloadLocationPayer(postParams){
    return this.apiService.post('dataimportlocation/locationpayertemplate', postParams)
  }

  public uploadLocationPayer(postParams){
    return this.apiService.postFile('dataimportlocation/locationpayertemplateimport', postParams);
  }

  public downloadLocation(postParams){
    return this.apiService.post('dataimportlocation/locationtemplate', postParams)
  }

  public uploadLocation(postParams){
    return this.apiService.postFile('dataimportlocation/locationtemplateimport', postParams);
  }
}
