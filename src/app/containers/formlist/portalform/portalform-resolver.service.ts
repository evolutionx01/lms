import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { FormViewService } from '../services/form-view/form-view.service';
// import { Group } from '../models/group.model'

@Injectable()
export class PortalformResolver {
  
  constructor( 
    private router: Router,
    private spinner: NgxSpinnerService,
    private FormService: FormViewService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot

  )
  :Observable<any>{
    // console.log(route.params);

   let customerList = this.FormService.getCustomers()
   return customerList;
  }

}
