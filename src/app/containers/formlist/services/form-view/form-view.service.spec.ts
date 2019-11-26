import { TestBed, inject } from '@angular/core/testing';

import { FormViewService } from './form-view.service';

describe('FormViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormViewService]
    });
  });

  it('should be created', inject([FormViewService], (service: FormViewService) => {
    expect(service).toBeTruthy();
  }));
});
