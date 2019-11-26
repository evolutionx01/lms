import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { DatamigrationComponent } from './datamigration/datamigration.component';
import { DataimportViewComponent } from './dataimport-view/dataimport-view.component';
import { DatauploadViewComponent } from './dataupload-view/dataupload-view.component';



const routes: Routes = [
  {
    path:'migration',
    component:DatamigrationComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'import',
    component: DataimportViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'caqh',
    component: DatauploadViewComponent,
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule { }
