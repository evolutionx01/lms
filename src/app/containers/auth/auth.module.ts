import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-toggle-switch';

import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { ClickStopPropagation } from '../../shared/directives/stop-propagation.directive';




@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    UiSwitchModule
  ],
  declarations: [SigninComponent,ClickStopPropagation ],
  providers:[]
})
export class AuthModule { }
