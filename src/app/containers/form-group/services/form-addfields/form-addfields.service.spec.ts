import { TestBed, inject } from '@angular/core/testing';

import { FormAddfieldsService } from './form-addfields.service';

describe('FormAddfieldsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormAddfieldsService]
    });
  });

  it('should be created', inject([FormAddfieldsService], (service: FormAddfieldsService) => {
    expect(service).toBeTruthy();
  }));
});
