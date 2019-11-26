import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPrivilegeEditComponent } from './access-privilege-edit.component';

describe('AccessPrivilegeEditComponent', () => {
  let component: AccessPrivilegeEditComponent;
  let fixture: ComponentFixture<AccessPrivilegeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPrivilegeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPrivilegeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
