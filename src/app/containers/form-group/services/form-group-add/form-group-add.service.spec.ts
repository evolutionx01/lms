import { TestBed, inject } from '@angular/core/testing';

import { FormGroupAddService } from './form-group-add.service';

describe('FormGroupAddService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormGroupAddService]
    });
  });

  it('should be created', inject([FormGroupAddService], (service: FormGroupAddService) => {
    expect(service).toBeTruthy();
  }));
});
