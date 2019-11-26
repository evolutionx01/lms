import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatamigrationService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getCustomer() {
    return this.apiService.get('dataimport/customerlist');
  }

  // public postTinList(postParams) {
  //   return this.apiService.post('providercreate/gettindropDown', postParams);
  // }

  public postTinDataTransfer(postParams){
    return this.apiService.post('datamigration/tinmigration', postParams);
  }

  public postProviderDataTransfer(postParams){
    return this.apiService.post('datamigration/providermigration', postParams);
  }

  public postLocationDataTransfer(postParams){
    return this.apiService.post('datamigration/locationmigration', postParams);
  }



  public postTinList(fromParams, toParams ) {

    let fCustomer = this.apiService.post('providercreate/gettindropDown', fromParams);
    let tCustomer = this.apiService.post('providercreate/gettindropDown', toParams);

    return forkJoin([fCustomer, tCustomer]);
  }

  public postProviderList(fromParams, toParams ) {

    let fCustomer = this.apiService.post('caqh/getproviderdropdown', fromParams);
    let tCustomer = this.apiService.post('caqh/getproviderdropdown', toParams);

    return forkJoin([fCustomer, tCustomer]);
  }

  public postLocationList(fromParams, toParams ) {

    let fCustomer = this.apiService.post('providercreate/getlocationdropdown', fromParams);
    let tCustomer = this.apiService.post('providercreate/getlocationdropdown', toParams);

    return forkJoin([fCustomer, tCustomer]);
  }

  public getTinList(fromParams, toParams) {

    let fCustomer = this.apiService.post('providercreate/gettindropDown', fromParams);
    let tCustomer = this.apiService.post('providercreate/gettindropDown', toParams);

    return forkJoin([fCustomer, tCustomer]);
  
  }

}
