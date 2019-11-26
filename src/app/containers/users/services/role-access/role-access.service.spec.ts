import { TestBed, inject } from '@angular/core/testing';

import { RoleAccessService } from './role-access.service';

describe('RoleAccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleAccessService]
    });
  });

  it('should be created', inject([RoleAccessService], (service: RoleAccessService) => {
    expect(service).toBeTruthy();
  }));
});
