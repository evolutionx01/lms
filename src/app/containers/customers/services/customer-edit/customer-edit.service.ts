import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerEditService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getEditCustomerDetails(postParams){

    let editData =  this.apiService.post('customer/getuserdetails',postParams);
    let licData =  this.apiService.post('license/getcustomerlicenseinfo',postParams);

    return forkJoin([editData,licData]);
  }

  public postEditCustomerDetails(postParams){
    return this.apiService.post('customer/edituser', postParams);
  }

  public getMasterDeatils(){
    return this.apiService.get('customer/getmasterstate');
  }

  public getCustomerLocation(data){
    return this.apiService.post('customer/getpracticelocation',data);
  }

  public getAppUserData(data){
    return this.apiService.post('customer/getappusers',data);
  }

  public getAccessibleState(data){
    return this.apiService.post('license/getlicensestates',data);
  }

  public getProviderDetails(postParams){
    return this.apiService.post('customer/getproviders',postParams)
  }

  public getPayers(data){
    return this.apiService.post('license/getlicenestatepayers',data);
  }

  // public addState(data){
  //   return this.apiService.post('license/licenseinfoupdate',data)
  // }

  public addState(data){
      return this.apiService.post('license/updatesccessiblestates',data)
    }


  public deleteProvider(data){
    return this.apiService.post('provider/delete',data)
  }

  public deactivateProvider(data){
    return this.apiService.post('provider/activatedeactivate',data)
  }

  public deactivateAppUsers(data){
    return this.apiService.post('customer/deactivateappuser',data)
  }

  public getCustomerTin(params){
    return this.apiService.post('customer/gettins',params)
  }

  public updateAppUserEmail(params){
    return this.apiService.post('customer/updateappuser',params)
  }

  public updateProviderEmail(params){
    return this.apiService.post('customer/updatepportalusermail',params)
  }

  public deactivateTin(data){
    return this.apiService.post('customer/activatetins',data)
  }

  public deactivateLocation (data){
    return this.apiService.post('customer/updatelocationstatus',data)
  }


  public postMapPayerState (data){
    return this.apiService.post('customer/mappayersstate',data)
  }

  /**
   * name
   */
  public postPortalProviderAccess( postParams) {
    return this.apiService.post('customer/portalprovideractivate', postParams)
  }


  // export Api

  public exportProviderList(postParams){
    return this.apiService.post('customer/getprovidersexcel',postParams)
  }

  public exportAppUserList(postParams){
    return this.apiService.post('customer/getappuserexcel',postParams)
  }

  public exportTinList(postParams){
    return this.apiService.post('customer/gettinexcel',postParams)
  }

  public exportLocationList(postParams){
    return this.apiService.post('customer/getlocationexcel',postParams)
  }
  

}
