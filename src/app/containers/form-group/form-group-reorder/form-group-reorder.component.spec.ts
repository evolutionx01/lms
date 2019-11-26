import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroupReorderComponent } from './form-group-reorder.component';

describe('FormGroupReorderComponent', () => {
  let component: FormGroupReorderComponent;
  let fixture: ComponentFixture<FormGroupReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGroupReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
