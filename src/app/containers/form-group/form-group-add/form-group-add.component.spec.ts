import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroupAddComponent } from './form-group-add.component';

describe('FormGroupAddComponent', () => {
  let component: FormGroupAddComponent;
  let fixture: ComponentFixture<FormGroupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGroupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
