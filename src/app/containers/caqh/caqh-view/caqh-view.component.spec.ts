import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaqhViewComponent } from './caqh-view.component';

describe('CaqhViewComponent', () => {
  let component: CaqhViewComponent;
  let fixture: ComponentFixture<CaqhViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaqhViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaqhViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
