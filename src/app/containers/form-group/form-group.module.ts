import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormGroupViewComponent } from './form-group-view/form-group-view.component';
import { FormGroupRoutingModule } from './form-group-routing.module';
import { FormSubgroupViewComponent } from './form-subgroup-view/form-subgroup-view.component';
import { FormGroupAddComponent } from './form-group-add/form-group-add.component';
import { FormSubgroupAddComponent } from './form-subgroup-add/form-subgroup-add.component';
import { FormGroupModalComponent } from './form-group-modal/form-group-modal.component';
import { FormGroupReorderComponent } from './form-group-reorder/form-group-reorder.component';
import { FormAddfieldsComponent } from './form-addfields/form-addfields.component';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    FormGroupRoutingModule,
    NgSelectModule
  ],
  declarations: [
    FormGroupViewComponent,
    FormSubgroupViewComponent,
    FormGroupAddComponent,
    FormSubgroupAddComponent,
    FormGroupModalComponent,
    FormGroupReorderComponent,
    FormAddfieldsComponent
  ],
  entryComponents: [FormGroupAddComponent, FormSubgroupAddComponent, FormGroupModalComponent, FormGroupReorderComponent, FormAddfieldsComponent],
})
export class FormGroupModule { }
