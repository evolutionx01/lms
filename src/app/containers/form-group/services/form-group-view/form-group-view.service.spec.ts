import { TestBed, inject } from '@angular/core/testing';

import { FormGroupViewService } from './form-group-view.service';

describe('FormGroupViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormGroupViewService]
    });
  });

  it('should be created', inject([FormGroupViewService], (service: FormGroupViewService) => {
    expect(service).toBeTruthy();
  }));
});
