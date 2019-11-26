import { TestBed, inject } from '@angular/core/testing';

import { CaqhViewService } from './caqh-view.service';

describe('CaqhViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaqhViewService]
    });
  });

  it('should be created', inject([CaqhViewService], (service: CaqhViewService) => {
    expect(service).toBeTruthy();
  }));
});
