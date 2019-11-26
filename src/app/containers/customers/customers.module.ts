import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomersRoutingModule } from './customers-routing.module';
import { TestGridComponent } from '../test-grid/test-grid.component';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';
import { NgxToggleModule } from 'ngx-toggle';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { CustomerEditResolver } from './customer-edit/customer-edit-resolver.service';
import { CustomerReportsComponent } from './customer-reports/customer-reports.component';


@NgModule({
  imports: [
    CommonModule,
    CustomersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    SimplePdfViewerModule,
    NgSelectModule,
    NgxToggleModule,
    UiSwitchModule
  ],
  declarations: [
    TestGridComponent,
    CustomerViewComponent,
    CustomerFormComponent,
    CustomerEditComponent,
    CustomerModalComponent,
    CustomerReportsComponent
  ],
  entryComponents: [CustomerFormComponent, CustomerModalComponent],
  providers: [
    CustomerEditResolver
  ]
})
export class CustomersModule { }
