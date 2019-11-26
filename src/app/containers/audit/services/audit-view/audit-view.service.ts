import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditViewService {

  constructor(
    private apiService: ApiServiceService
  ) { }

  public getAuditDetails(params) {
    return this.apiService.post('audit', params);
  }

  public getAuditModules() {
    return this.apiService.get('audit/modules');
  }

  public getAuditModulesFields(params) {
    return this.apiService.post('audit/fields', params);
  }

  public exportDataToExcel(dataParams) {
    return this.apiService.post('audit/aduitlistexcel', dataParams);
  }
}
