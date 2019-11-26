import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './containers/auth/auth-guard/auth-guard';
import { AuthService } from './containers/auth/auth-guard/auth.service';
import { SharedModule } from './shared/modules/shared/shared.module';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { SideNavComponent } from './shared/layout/side-nav/side-nav.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { TagInputModule } from 'ngx-chips';
import { ScrollbarModule } from 'ngx-scrollbar';
import { CarouselModule } from 'ngx-owl-carousel-o';



@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    SideNavComponent,
    HeaderComponent
  ],
  imports: [
    TagInputModule,
    ScrollbarModule,
    BrowserModule,
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    BrowserAnimationsModule,
    NgbDropdownModule,
    FormsModule,
    AppRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbModule.forRoot(),
    HttpClientModule,
    ToastrModule.forRoot(),
    UiSwitchModule,
    CarouselModule 
  ],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
