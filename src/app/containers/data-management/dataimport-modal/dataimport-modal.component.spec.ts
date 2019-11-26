import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataimportModalComponent } from './dataimport-modal.component';

describe('DataimportModalComponent', () => {
  let component: DataimportModalComponent;
  let fixture: ComponentFixture<DataimportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataimportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataimportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
