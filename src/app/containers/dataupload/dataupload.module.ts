import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatauploadViewComponent } from './dataupload-view/dataupload-view.component';
import { DatauploadRoutingModule } from './dataupload-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatauploadModalComponent } from './dataupload-modal/dataupload-modal.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { NgxToggleModule } from 'ngx-toggle';
import { UiSwitchModule } from 'ngx-toggle-switch';


@NgModule({
  imports: [
    CommonModule,
    DatauploadRoutingModule,
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
    DatauploadViewComponent, 
    DatauploadModalComponent
  ],
  entryComponents: [DatauploadModalComponent],
})
export class DatauploadModule { }
