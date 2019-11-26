import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownViewComponent } from './dropdown-view/dropdown-view.component';
import { DropdownAddComponent } from './dropdown-add/dropdown-add.component';
import { dropdownRoutingModule } from './dropdown-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    dropdownRoutingModule,
    NgbModule,
    NgxDatatableModule,
    FormsModule, 
    ReactiveFormsModule,
  ],
  declarations: [DropdownViewComponent, DropdownAddComponent],
  entryComponents: [ DropdownAddComponent]
})
export class DropdownModule { }
