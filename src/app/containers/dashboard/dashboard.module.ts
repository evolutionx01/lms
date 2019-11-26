import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { CommonModule } from '@angular/common';
import { dashboardRoutingModule } from './dashboard-routing.module';
import { DashboardItemComponent } from './dashboard-item/dashboard-item.component';

import { ChartModule } from 'angular-highcharts';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { DashboardModalComponent } from './dashboard-modal/dashboard-modal.component';



@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    dashboardRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule, 
    ReactiveFormsModule,
    ChartModule,
    BsDatepickerModule.forRoot(),
  ],
  entryComponents: [DashboardModalComponent],
  declarations: [DashboardItemComponent, DashboardModalComponent]
})
export class DashboardModule { }
