import { TestBed, inject } from '@angular/core/testing';

import { FormAddService } from './form-add.service';

describe('FormAddService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormAddService]
    });
  });

  it('should be created', inject([FormAddService], (service: FormAddService) => {
    expect(service).toBeTruthy();
  }));
});
