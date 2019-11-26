import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestGridComponent } from '../test-grid/test-grid.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerEditResolver } from './customer-edit/customer-edit-resolver.service';
import { CustomerReportsComponent } from './customer-reports/customer-reports.component';


const routes: Routes = [
  {
    path: '',
    component: CustomerViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:customer_id',
    component: CustomerEditComponent,
    canActivate: [AuthGuard],
    resolve: {
      customer_edit: CustomerEditResolver
    }
  },
  {
    path: 'reports',
    component: CustomerReportsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'test',
    component: TestGridComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
