import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestGridComponent } from '../test-grid/test-grid.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { AuditViewComponent } from './audit-view/audit-view.component';



const routes: Routes = [
  {
    path:'',
    component:AuditViewComponent,
    canActivate: [AuthGuard],
    // resolve :{
    //   customer_view:CustomerViewResolver
      
    // }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }
