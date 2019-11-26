import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';


@Injectable({
  providedIn: 'root'
})
export class RoleAccessService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public getModuleDetails(data){
    return this.apiService.post('auth/moduleFeatures',data);
  }

}
