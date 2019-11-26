import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroupModalComponent } from './form-group-modal.component';

describe('FormGroupModalComponent', () => {
  let component: FormGroupModalComponent;
  let fixture: ComponentFixture<FormGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
