import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatauploadViewComponent } from './dataupload-view.component';

describe('DatauploadViewComponent', () => {
  let component: DatauploadViewComponent;
  let fixture: ComponentFixture<DatauploadViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatauploadViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatauploadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
