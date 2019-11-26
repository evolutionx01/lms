import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderViewComponent } from './provider-view/provider-view.component';
import { ProviderRoutingModule } from './provider-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProviderRoutingModule
  ],
  declarations: [ProviderViewComponent]
})
export class ProviderModule { }
