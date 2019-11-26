import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard/auth-guard';

import { FormGroupViewComponent } from './form-group-view/form-group-view.component';
import { FormSubgroupViewComponent } from './form-subgroup-view/form-subgroup-view.component';

// FormSubgroupViewComponent
const routes: Routes = [
  {
    path: '',
    component: FormGroupViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'subgroup/:group_id',
    component:FormSubgroupViewComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormGroupRoutingModule { }
