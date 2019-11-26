import { TestBed, inject } from '@angular/core/testing';

import { DataimportViewService } from './dataimport-view.service';

describe('DataimportViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataimportViewService]
    });
  });

  it('should be created', inject([DataimportViewService], (service: DataimportViewService) => {
    expect(service).toBeTruthy();
  }));
});
