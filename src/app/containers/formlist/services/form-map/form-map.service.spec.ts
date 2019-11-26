import { TestBed, inject } from '@angular/core/testing';

import { FormMapService } from './form-map.service';

describe('FormMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormMapService]
    });
  });

  it('should be created', inject([FormMapService], (service: FormMapService) => {
    expect(service).toBeTruthy();
  }));
});
