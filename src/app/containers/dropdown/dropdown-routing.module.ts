import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { DropdownViewComponent } from './dropdown-view/dropdown-view.component';
import { DropdownAddComponent } from './dropdown-add/dropdown-add.component';

const routes: Routes = [
  {
    path: '',
    component: DropdownViewComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class dropdownRoutingModule { }
