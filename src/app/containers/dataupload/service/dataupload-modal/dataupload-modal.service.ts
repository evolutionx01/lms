import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatauploadModalService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public forceUpdateCAQHFrom(postParams) {
    return this.apiService.post('caqh/updateprovidermismatchdata', postParams);
  }
}
