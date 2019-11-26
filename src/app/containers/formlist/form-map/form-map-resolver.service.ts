import { Injectable, } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormMapService } from '../services/form-map/form-map.service';

// import { Group } from '../models/group.model'

@Injectable()
export class FormMapResolver {
  
  constructor( 
    private router: Router,

    private formMapService:FormMapService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):Observable<any>{

    console.log(route.params)
  let formFieldData = this.formMapService.getFormList(route.params); 
    return formFieldData;
  }

}
