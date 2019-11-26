import { TestBed, inject } from '@angular/core/testing';

import { DatamigrationService } from './datamigration.service';

describe('DatamigrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatamigrationService]
    });
  });

  it('should be created', inject([DatamigrationService], (service: DatamigrationService) => {
    expect(service).toBeTruthy();
  }));
});
