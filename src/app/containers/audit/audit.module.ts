import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditViewComponent } from './audit-view/audit-view.component';
import { AuditRoutingModule } from './audit-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    AuditRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule
  ],
  declarations: [
    AuditViewComponent
  ]
})
export class AuditModule { }
