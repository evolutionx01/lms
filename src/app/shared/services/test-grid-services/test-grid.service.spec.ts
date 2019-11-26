import { TestBed, inject } from '@angular/core/testing';

import { TestGridService } from './test-grid.service';

describe('TestGridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestGridService]
    });
  });

  it('should be created', inject([TestGridService], (service: TestGridService) => {
    expect(service).toBeTruthy();
  }));
});
