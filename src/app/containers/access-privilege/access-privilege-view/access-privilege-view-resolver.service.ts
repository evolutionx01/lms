import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { AccessPrivilegeViewService } from '../service/access-privilege-view/access-privilege-view.service';
// import { Group } from '../models/group.model'

@Injectable()
export class AccessPrivilegeViewResolver {
  
  constructor( 
    private router: Router,
    private spinner: NgxSpinnerService,
    private accessPrivilegeViewService:AccessPrivilegeViewService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot

  )
  :Observable<any>{
    // console.log(route.params);

   let accessPrivilegeTitle = this.accessPrivilegeViewService.getAccessPrivilegeKey()
   return accessPrivilegeTitle;
  }

}
