import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UsersRoutingModule } from './users-routing.module';
import { UsersviewComponent } from './usersview/usersview.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UseraddComponent } from './useradd/useradd.component';
import { RoleviewComponent } from './roleview/roleview.component';
import { UsermodalComponent } from './usermodal/usermodal.component';
import { RoleaddComponent } from './roleadd/roleadd.component';
import { RoleAccessComponent } from './role-access/role-access.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    NgbDropdownModule,
    NgSelectModule
  ],
  declarations: [UsersviewComponent, UseraddComponent, RoleviewComponent, UsermodalComponent, RoleaddComponent, RoleAccessComponent],
  entryComponents: [UseraddComponent,UsermodalComponent,RoleaddComponent]
})
export class UsersModule { }
