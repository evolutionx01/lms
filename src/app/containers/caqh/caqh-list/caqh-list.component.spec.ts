import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaqhListComponent } from './caqh-list.component';

describe('CaqhListComponent', () => {
  let component: CaqhListComponent;
  let fixture: ComponentFixture<CaqhListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaqhListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaqhListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
