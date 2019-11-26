import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlistRoutingModule } from './formlist-routing.module';
import { FormViewComponent } from './form-view/form-view.component';
import { FormViewResolver } from './form-view/form-view-resolver.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormAddComponent } from './form-add/form-add.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormModalComponent } from './form-modal/form-modal.component';
import { FormMapComponent } from './form-map/form-map.component';
import { FormMapResolver } from './form-map/form-map-resolver.service';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { FormMapModalComponent } from './form-map-modal/form-map-modal.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { EsignModalComponent } from './esign-modal/esign-modal.component';
import { PortalformComponent } from './portalform/portalform.component';
import { PortalmodalComponent } from './portalmodal/portalmodal.component';
import { PortalformResolver } from './portalform/portalform-resolver.service';
import { FormAddModalComponent } from './form-add-modal/form-add-modal.component';
import { FormBrowserComponent } from './form-browser/form-browser.component';
import { FormBrowserAddComponent } from './form-browser-add/form-browser-add.component';


@NgModule({
  imports: [
    CommonModule,
    FormlistRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    NgbDropdownModule,
    NgSelectModule,
    SimplePdfViewerModule,
    UiSwitchModule
  ],
  declarations: [
    FormViewComponent,
    FormAddComponent, 
    FormModalComponent, 
    FormMapComponent, 
    FormMapModalComponent, EsignModalComponent, PortalformComponent, PortalmodalComponent, FormAddModalComponent, FormBrowserComponent, FormBrowserAddComponent
  ],
  providers: [
    FormViewResolver,
    FormMapResolver,
    PortalformResolver
  ],
  entryComponents: [FormAddComponent, FormModalComponent, FormMapModalComponent,EsignModalComponent,PortalmodalComponent, FormAddModalComponent, FormBrowserAddComponent]
})
export class FormlistModule { }
