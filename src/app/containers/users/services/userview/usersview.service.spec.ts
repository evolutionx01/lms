import { TestBed, inject } from '@angular/core/testing';

import { UsersviewService } from './usersview.service';

describe('UsersviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersviewService]
    });
  });

  it('should be created', inject([UsersviewService], (service: UsersviewService) => {
    expect(service).toBeTruthy();
  }));
});
