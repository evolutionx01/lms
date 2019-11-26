import { TestBed, inject } from '@angular/core/testing';

import { FormGroupReorderService } from './form-group-reorder.service';

describe('FormGroupReorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormGroupReorderService]
    });
  });

  it('should be created', inject([FormGroupReorderService], (service: FormGroupReorderService) => {
    expect(service).toBeTruthy();
  }));
});
