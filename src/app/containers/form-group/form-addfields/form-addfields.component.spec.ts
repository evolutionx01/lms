import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddfieldsComponent } from './form-addfields.component';

describe('FormAddfieldsComponent', () => {
  let component: FormAddfieldsComponent;
  let fixture: ComponentFixture<FormAddfieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddfieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
