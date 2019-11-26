import { TestBed, inject } from '@angular/core/testing';

import { FormMapModalService } from './form-map-modal.service';

describe('FormMapModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormMapModalService]
    });
  });

  it('should be created', inject([FormMapModalService], (service: FormMapModalService) => {
    expect(service).toBeTruthy();
  }));
});
