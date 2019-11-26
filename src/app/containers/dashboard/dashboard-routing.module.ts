import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestGridComponent } from '../test-grid/test-grid.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { DashboardItemComponent } from './dashboard-item/dashboard-item.component';


const routes: Routes = [
  {
    path:'',
    component:DashboardItemComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class dashboardRoutingModule { }
