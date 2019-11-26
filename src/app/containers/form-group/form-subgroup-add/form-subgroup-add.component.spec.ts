import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubgroupAddComponent } from './form-subgroup-add.component';

describe('FormSubgroupAddComponent', () => {
  let component: FormSubgroupAddComponent;
  let fixture: ComponentFixture<FormSubgroupAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSubgroupAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSubgroupAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
