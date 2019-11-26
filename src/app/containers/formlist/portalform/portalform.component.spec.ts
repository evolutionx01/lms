import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalformComponent } from './portalform.component';

describe('PortalformComponent', () => {
  let component: PortalformComponent;
  let fixture: ComponentFixture<PortalformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
