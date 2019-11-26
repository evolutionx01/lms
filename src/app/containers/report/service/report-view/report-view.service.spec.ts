import { TestBed, inject } from '@angular/core/testing';

import { ReportViewService } from './report-view.service';

describe('ReportViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportViewService]
    });
  });

  it('should be created', inject([ReportViewService], (service: ReportViewService) => {
    expect(service).toBeTruthy();
  }));
});
