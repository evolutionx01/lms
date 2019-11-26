import { TestBed, inject } from '@angular/core/testing';

import { AccessPrivilegeViewService } from './access-privilege-view.service';

describe('AccessPrivilegeViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccessPrivilegeViewService]
    });
  });

  it('should be created', inject([AccessPrivilegeViewService], (service: AccessPrivilegeViewService) => {
    expect(service).toBeTruthy();
  }));
});
