import { TestBed, inject } from '@angular/core/testing';

import { FormSubgroupViewService } from './form-subgroup-view.service';

describe('FormSubgroupViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormSubgroupViewService]
    });
  });

  it('should be created', inject([FormSubgroupViewService], (service: FormSubgroupViewService) => {
    expect(service).toBeTruthy();
  }));
});
