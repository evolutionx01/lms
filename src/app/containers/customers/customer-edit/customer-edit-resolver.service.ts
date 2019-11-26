import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerEditService } from '../services/customer-edit/customer-edit.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { Group } from '../models/group.model'

@Injectable()
export class CustomerEditResolver {
  
  constructor( 
    private router: Router,
    private spinner: NgxSpinnerService,
    private customerEditService:CustomerEditService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot

  ):Observable<any>{
    // console.log(route.params);

   let customerEditData = this.customerEditService.getEditCustomerDetails(route.params)
   return customerEditData;
  }

}
