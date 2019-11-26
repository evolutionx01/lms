import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { ProviderViewComponent } from './provider-view/provider-view.component';

const routes: Routes = [
  {
    path:'',
    component:ProviderViewComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
