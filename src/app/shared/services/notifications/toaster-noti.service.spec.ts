import { TestBed, inject } from '@angular/core/testing';

import { ToasterNotiService } from './toaster-noti.service';

describe('ToasterNotiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToasterNotiService]
    });
  });

  it('should be created', inject([ToasterNotiService], (service: ToasterNotiService) => {
    expect(service).toBeTruthy();
  }));
});
