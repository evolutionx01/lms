import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataimportViewComponent } from './dataimport-view.component';

describe('DataimportViewComponent', () => {
  let component: DataimportViewComponent;
  let fixture: ComponentFixture<DataimportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataimportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataimportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
