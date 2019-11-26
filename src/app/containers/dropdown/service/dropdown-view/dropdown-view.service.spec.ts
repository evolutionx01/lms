import { TestBed, inject } from '@angular/core/testing';

import { DropdownViewService } from './dropdown-view.service';

describe('DropdownViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropdownViewService]
    });
  });

  it('should be created', inject([DropdownViewService], (service: DropdownViewService) => {
    expect(service).toBeTruthy();
  }));
});
