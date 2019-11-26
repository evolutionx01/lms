import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatauploadModalComponent } from './dataupload-modal.component';

describe('DatauploadModalComponent', () => {
  let component: DatauploadModalComponent;
  let fixture: ComponentFixture<DatauploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatauploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatauploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
