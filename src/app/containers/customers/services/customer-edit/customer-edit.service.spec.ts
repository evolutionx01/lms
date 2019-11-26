import { TestBed, inject } from '@angular/core/testing';

import { CustomerEditService } from './customer-edit.service';

describe('CustomerEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerEditService]
    });
  });

  it('should be created', inject([CustomerEditService], (service: CustomerEditService) => {
    expect(service).toBeTruthy();
  }));
});
