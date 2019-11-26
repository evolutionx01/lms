import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBrowserAddComponent } from './form-browser-add.component';

describe('FormBrowserAddComponent', () => {
  let component: FormBrowserAddComponent;
  let fixture: ComponentFixture<FormBrowserAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBrowserAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBrowserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
