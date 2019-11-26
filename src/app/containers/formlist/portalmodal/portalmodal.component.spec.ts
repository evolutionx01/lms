import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalmodalComponent } from './portalmodal.component';

describe('PortalmodalComponent', () => {
  let component: PortalmodalComponent;
  let fixture: ComponentFixture<PortalmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
