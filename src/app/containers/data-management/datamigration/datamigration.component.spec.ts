import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatamigrationComponent } from './datamigration.component';

describe('DatamigrationComponent', () => {
  let component: DatamigrationComponent;
  let fixture: ComponentFixture<DatamigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatamigrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatamigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
