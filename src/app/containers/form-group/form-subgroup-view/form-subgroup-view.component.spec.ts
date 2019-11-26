import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubgroupViewComponent } from './form-subgroup-view.component';

describe('FormSubgroupViewComponent', () => {
  let component: FormSubgroupViewComponent;
  let fixture: ComponentFixture<FormSubgroupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSubgroupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSubgroupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
