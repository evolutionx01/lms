import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';

@Injectable({
  providedIn: 'root'
})
export class CaqhViewService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getCaqh(params) {
    return this.apiService.post('caqhProviewSync', params);
  }
}
