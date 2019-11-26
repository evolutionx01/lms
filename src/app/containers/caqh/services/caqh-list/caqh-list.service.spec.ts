import { TestBed, inject } from '@angular/core/testing';

import { CaqhListService } from './caqh-list.service';

describe('CaqhListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaqhListService]
    });
  });

  it('should be created', inject([CaqhListService], (service: CaqhListService) => {
    expect(service).toBeTruthy();
  }));
});
