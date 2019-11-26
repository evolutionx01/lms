import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestGridComponent } from '../test-grid/test-grid.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { AccessPrivilegeViewComponent } from './access-privilege-view/access-privilege-view.component';
import { AccessPrivilegeViewResolver } from './access-privilege-view/access-privilege-view-resolver.service';




const routes: Routes = [
  {
    path:'',
    component:AccessPrivilegeViewComponent,
    canActivate: [AuthGuard],
    resolve: {
      accessPrivilegeData : AccessPrivilegeViewResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessPrivilegeRoutingModule { }
