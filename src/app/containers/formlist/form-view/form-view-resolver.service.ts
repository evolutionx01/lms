import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FormViewService } from '../services/form-view/form-view.service';

// import { Group } from '../models/group.model'

@Injectable()
export class FormViewResolver {

  constructor(
    private router: Router,
    private FormService: FormViewService,

  ) { }
  resData;
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {

    let payerParams = {
      "code": "payer",
      "item_id": ''
    }
    let formTypeParams = {
      page_number: "",
      limit_of_page: ""
    }
    let masterDropdownData = this.FormService.getMasterDropdownData(payerParams,formTypeParams)
    return masterDropdownData;
  }



}
