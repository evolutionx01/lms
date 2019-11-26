import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './containers/auth/auth-guard/auth-guard';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';


const routes: Routes = [
  {
    path:'',
    loadChildren:'./containers/auth/auth.module#AuthModule'
  },
 
  {
    path:'',
    component:MainLayoutComponent,
    canActivate:[AuthGuard],
    children:[
      {
        path:'dashboard',
        loadChildren: './containers/dashboard/dashboard.module#DashboardModule',
      },
      {
        path:'customer',
        loadChildren: './containers/customers/customers.module#CustomersModule',
      },
      {
        path:'formlist',
        loadChildren: './containers/formlist/formlist.module#FormlistModule',
      },
      {
        path:'user',
        loadChildren: './containers/users/users.module#UsersModule',
      },
      {
        path:'audit',
        loadChildren: './containers/audit/audit.module#AuditModule',
      },
      {
        path:'groups',
        loadChildren: './containers/form-group/form-group.module#FormGroupModule',
      },
      {
        path:'dropdown',
        loadChildren: './containers/dropdown/dropdown.module#DropdownModule',
      },
      {
        path:'caqh',
        loadChildren: './containers/dataupload/dataupload.module#DatauploadModule',
      },
      {
        path:'access_privilege',
        loadChildren: './containers/access-privilege/access-privilege.module#AccessPrivilegeModule',
      },
      {
        path:'reports',
        loadChildren: './containers/report/report.module#ReportModule',
      },
      {
        path:'dataimport',
        loadChildren: './containers/dataimport/dataimport.module#DataimportModule',
      },
      {
        path:'data',
        loadChildren: './containers/data-management/data-management.module#DataManagementModule',
      },
      {
        path:'caqhview',
        loadChildren: './containers/caqh/caqh.module#CaqhModule',
      }
      
    ]
  },
  
  {
    path:'**',
    redirectTo:'',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
