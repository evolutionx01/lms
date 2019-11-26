import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessPrivilegeComponent } from './access-privilege.component';

describe('AccessPrivilegeComponent', () => {
  let component: AccessPrivilegeComponent;
  let fixture: ComponentFixture<AccessPrivilegeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPrivilegeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
