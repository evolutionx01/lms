import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroupViewComponent } from './form-group-view.component';

describe('FormGroupViewComponent', () => {
  let component: FormGroupViewComponent;
  let fixture: ComponentFixture<FormGroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
