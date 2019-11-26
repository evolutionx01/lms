import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaqhViewComponent } from './caqh-view/caqh-view.component';
import { CaqhRoutingModule } from './caqh-routing.module';
import { CaqhListComponent } from './caqh-list/caqh-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  imports: [
    CommonModule,
    CaqhRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule,
    CarouselModule
  ],
  declarations: [CaqhViewComponent, CaqhListComponent]
})
export class CaqhModule { }
