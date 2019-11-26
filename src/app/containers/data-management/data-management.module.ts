import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatamigrationComponent } from './datamigration/datamigration.component';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxToggleModule } from 'ngx-toggle';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { DataimportViewComponent } from './dataimport-view/dataimport-view.component';
import { DataimportModalComponent } from './dataimport-modal/dataimport-modal.component';
import { DatauploadViewComponent } from './dataupload-view/dataupload-view.component';
import { DatauploadModalComponent } from './dataupload-modal/dataupload-modal.component';

@NgModule({
  imports: [
    CommonModule,
    DataManagementRoutingModule,
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
    DatamigrationComponent,
    DataimportViewComponent, 
    DataimportModalComponent, 
    DatauploadViewComponent, 
    DatauploadModalComponent
  ],
  entryComponents: [DataimportModalComponent, DatauploadModalComponent],
})
export class DataManagementModule { }
