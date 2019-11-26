import { TestBed, inject } from '@angular/core/testing';

import { ProviderViewService } from './provider-view.service';

describe('ProviderViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderViewService]
    });
  });

  it('should be created', inject([ProviderViewService], (service: ProviderViewService) => {
    expect(service).toBeTruthy();
  }));
});
