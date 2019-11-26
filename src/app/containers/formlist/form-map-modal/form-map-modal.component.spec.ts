import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMapModalComponent } from './form-map-modal.component';

describe('FormMapModalComponent', () => {
  let component: FormMapModalComponent;
  let fixture: ComponentFixture<FormMapModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMapModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
