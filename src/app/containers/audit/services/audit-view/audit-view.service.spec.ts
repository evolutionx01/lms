import { TestBed, inject } from '@angular/core/testing';

import { AuditViewService } from './audit-view.service';

describe('AuditViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuditViewService]
    });
  });

  it('should be created', inject([AuditViewService], (service: AuditViewService) => {
    expect(service).toBeTruthy();
  }));
});
