import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainFooterComponent } from './shared/layout/main-footer/main-footer.component';
import { MainHeaderComponent } from './shared/layout/main-header/main-header.component';
import { MainSidebarComponent } from './shared/layout/main-sidebar/main-sidebar.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { ControlSidebarComponent } from './shared/layout/control-sidebar/control-sidebar.component';
import { AppCommonModule } from './app.common.module';
import { DataTablesModule } from 'angular-datatables';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import material from '@primeng/themes/material'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MainFooterComponent,
    MainHeaderComponent,
    MainSidebarComponent,
    ControlSidebarComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppCommonModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },

   
    providePrimeNG({
      theme: {
        preset: material,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
