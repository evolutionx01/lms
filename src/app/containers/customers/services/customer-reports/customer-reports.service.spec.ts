import { TestBed, inject } from '@angular/core/testing';

import { CustomerReportsService } from './customer-reports.service';

describe('CustomerReportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerReportsService]
    });
  });

  it('should be created', inject([CustomerReportsService], (service: CustomerReportsService) => {
    expect(service).toBeTruthy();
  }));
});
