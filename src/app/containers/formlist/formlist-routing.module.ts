import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { FormViewComponent } from './form-view/form-view.component';
import { AuthGuard } from '../auth/auth-guard/auth-guard';
import { FormViewResolver } from './form-view/form-view-resolver.service';
import { FormMapComponent } from './form-map/form-map.component';
import { FormMapResolver } from './form-map/form-map-resolver.service';
import { PortalformComponent } from './portalform/portalform.component';
import { PortalformResolver } from './portalform/portalform-resolver.service';
import { FormBrowserComponent } from './form-browser/form-browser.component';


const routes: Routes = [

  {
    path: 'view',
    component: FormViewComponent,
    canActivate: [AuthGuard],
    resolve: {
      form_view: FormViewResolver
    },
  },  {
    path: 'browser',
    component: FormBrowserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'view/map/:form_id',
    component: FormMapComponent,
    canActivate: [AuthGuard],
    resolve: {
      form_field_map: FormMapResolver
    },
    data: [{isPreview: true}] 
    
  },
  {
    path: 'browser/map/:form_id',
    component: FormMapComponent,
    canActivate: [AuthGuard],
    resolve: {
      form_field_map: FormMapResolver
    },
    data: [{isPreview: false}] 
  },
  {
    path: 'portalform',
    component: PortalformComponent,
    canActivate: [AuthGuard], //PortalformResolver
    resolve: {
      customer_list: PortalformResolver
    },
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormlistRoutingModule {
  
 }
