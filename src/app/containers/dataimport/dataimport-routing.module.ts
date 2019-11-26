import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard/auth-guard';

import { DataimportViewComponent } from './dataimport-view/dataimport-view.component';


const routes: Routes = [
  {
    path:'',
    component:DataimportViewComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataImportRoutingModule { }
