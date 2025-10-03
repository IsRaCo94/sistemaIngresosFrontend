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
import { AppConfigComponent } from './app.config.component';
import { AppMainComponent } from './app.main.component';
import { AppSideBarComponent } from './app.sidebar.component';
import { AppTopbarComponent } from './app.topbar.component';
import { AppMenuComponent } from './app.menu.component';
import { AppFooterComponent } from './app.footer.component';
import { AppSidebartabcontentComponent } from './app.sidebartabcontent.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { AppErrorComponent } from './features/ingresos/component/error/app.error.component';
import { AppAccessdeniedComponent } from './features/ingresos/component/denegado/app.accessdenied.component';

@NgModule({
  declarations: [
    AppComponent,
    MainFooterComponent,
    MainHeaderComponent,
    MainSidebarComponent,
    ControlSidebarComponent,
    LayoutComponent,
    AppConfigComponent,
    AppMainComponent,
    AppSideBarComponent,
    AppSideBarComponent,
    AppTopbarComponent,
    AppMenuComponent,
    AppFooterComponent,
    AppSidebartabcontentComponent,
    AppMenuitemComponent,
    AppErrorComponent,
    AppAccessdeniedComponent,

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppCommonModule,
    BrowserAnimationsModule,
    RadioButtonModule,
    ButtonModule
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
