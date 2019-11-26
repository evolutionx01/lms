import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddModalComponent } from './form-add-modal.component';

describe('FormAddModalComponent', () => {
  let component: FormAddModalComponent;
  let fixture: ComponentFixture<FormAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
