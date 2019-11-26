import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { NgxToggleModule } from 'ngx-toggle';
import { UiSwitchModule } from 'ngx-toggle-switch';

import { DataimportViewComponent } from './dataimport-view/dataimport-view.component';
import { DataImportRoutingModule } from './dataimport-routing.module';
import { DataimportModalComponent } from './dataimport-modal/dataimport-modal.component';

@NgModule({
  imports: [
    CommonModule,
    DataImportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    SimplePdfViewerModule,
    NgSelectModule,
    NgxToggleModule,
    UiSwitchModule
  ],
  declarations: [DataimportViewComponent, DataimportModalComponent],
  entryComponents: [DataimportModalComponent],
})
export class DataimportModule { }
