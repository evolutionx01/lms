import { TestBed, inject } from '@angular/core/testing';

import { CustomerViewService } from './customer-view.service';

describe('CustomerViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerViewService]
    });
  });

  it('should be created', inject([CustomerViewService], (service: CustomerViewService) => {
    expect(service).toBeTruthy();
  }));
});
