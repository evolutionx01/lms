import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportViewComponent } from './report-view/report-view.component';
import { ReportRoutingModule } from './report-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxToggleModule } from 'ngx-toggle';
import { UiSwitchModule } from 'ngx-toggle-switch';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule,
    NgxToggleModule,
    UiSwitchModule
  ],
  declarations: [
    ReportViewComponent
  ]
})
export class ReportModule { }
