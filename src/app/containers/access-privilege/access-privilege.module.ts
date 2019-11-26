import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessPrivilegeViewComponent } from './access-privilege-view/access-privilege-view.component';
import { AccessPrivilegeRoutingModule } from './access-privilege-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { AccessPrivilegeComponent } from './access-privilege/access-privilege.component';
import { AccessPrivilegeViewResolver } from './access-privilege-view/access-privilege-view-resolver.service';
import { AccessPrivilegeEditComponent } from './access-privilege-edit/access-privilege-edit.component';

@NgModule({
  imports: [
    CommonModule,
    AccessPrivilegeRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule,
    UiSwitchModule
  ],
  declarations: [
    AccessPrivilegeViewComponent,
    AccessPrivilegeComponent,
    AccessPrivilegeEditComponent
  ],
  entryComponents: [AccessPrivilegeComponent, AccessPrivilegeEditComponent],

  providers: [
    AccessPrivilegeViewResolver
  ]
})
export class AccessPrivilegeModule { }
