import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersviewComponent } from './usersview/usersview.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { RoleviewComponent } from '../users/roleview/roleview.component';
import { RoleAccessComponent } from './role-access/role-access.component';

const routes: Routes = [
  {
    path: 'user_details',
    component: UsersviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'role_details',
    component: RoleviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'role_details/access',
    component: RoleAccessComponent,
    canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
