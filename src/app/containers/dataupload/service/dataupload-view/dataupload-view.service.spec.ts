import { TestBed, inject } from '@angular/core/testing';

import { DatauploadViewService } from './dataupload-view.service';

describe('DatauploadViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatauploadViewService]
    });
  });

  it('should be created', inject([DatauploadViewService], (service: DatauploadViewService) => {
    expect(service).toBeTruthy();
  }));
});
