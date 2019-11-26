import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBrowserComponent } from './form-browser.component';

describe('FormBrowserComponent', () => {
  let component: FormBrowserComponent;
  let fixture: ComponentFixture<FormBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
