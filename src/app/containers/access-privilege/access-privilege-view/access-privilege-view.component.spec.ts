import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPrivilegeViewComponent } from './access-privilege-view.component';

describe('AccessPrivilegeViewComponent', () => {
  let component: AccessPrivilegeViewComponent;
  let fixture: ComponentFixture<AccessPrivilegeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPrivilegeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPrivilegeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
