import { TestBed, inject } from '@angular/core/testing';

import { FormBrowserService } from './form-browser.service';

describe('FormBrowserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBrowserService]
    });
  });

  it('should be created', inject([FormBrowserService], (service: FormBrowserService) => {
    expect(service).toBeTruthy();
  }));
});
