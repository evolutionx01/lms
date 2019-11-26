import { TestBed, inject } from '@angular/core/testing';

import { DatauploadModalService } from './dataupload-modal.service';

describe('DatauploadModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatauploadModalService]
    });
  });

  it('should be created', inject([DatauploadModalService], (service: DatauploadModalService) => {
    expect(service).toBeTruthy();
  }));
});
