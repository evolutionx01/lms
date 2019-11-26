import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { CaqhViewComponent } from './caqh-view/caqh-view.component';
import { CaqhListComponent } from './caqh-list/caqh-list.component';




const routes: Routes = [
  {
    path:':id',
    component:CaqhViewComponent,
    canActivate: [AuthGuard],
    // resolve :{
    //   customer_view:CustomerViewResolver
      
    // }
  },
  {
    path:'',
    component:CaqhListComponent,
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
export class CaqhRoutingModule { }
