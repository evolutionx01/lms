import { Injectable } from '@angular/core';
import { ApiServiceService } from '../../../../shared/services/lms-api-service/api-service.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportViewService {

  constructor(
    private apiService:ApiServiceService
  ) { }

  public getUnloggedVisitorDetails(params){
    return this.apiService.post('reports/visitersNotLoggedIn', params);
  }

  public getLoggedVisitorDetails(params){
    return this.apiService.post('reports/visitersLoggedIn', params);
  }

  public exportNotVisited(params){
    return this.apiService.post('reports/visitersNotLoggedInExport', params);
  }

  public exportVisited(params){
    return this.apiService.post('reports/visitersLoggedInExport', params);
  }
}
