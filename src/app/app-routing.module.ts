import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { AppMainComponent } from './app.main.component';
import { AppErrorComponent } from './features/ingresos/component/error/app.error.component';
import { AppAccessdeniedComponent } from './features/ingresos/component/denegado/app.accessdenied.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'ingresos',
    pathMatch: 'full'
  },
  {
    path:'',
    component: LayoutComponent,
    children: [
  
      {
        path: 'ingresos',
        loadChildren:()=> import('./features/ingresos/ingresos.module').then(m=>m.IngresosModule)
      }
    ]

  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
// @NgModule({
//   imports: [
//       RouterModule.forRoot([
//           {
//               path: 'inicio',
//               component: AppMainComponent,
//               children: [
//                   // { path: '', component: InicioComponent },
//                   // { path: 'dashboard-afiliaciones', component: DashboardAfiliacionesComponent },
//                   // { path: 'dashboard-consulta-externa', component: DashboardConsultaExternaComponent },
//               ]
//           },
//           { path: 'error', component: AppErrorComponent },
//           { path: 'denegado', component: AppAccessdeniedComponent },
//           { path: '', redirectTo: '/inicio', pathMatch: 'full' },
//           { path: '**', redirectTo: '/error' },
//       ], { scrollPositionRestoration: 'enabled', useHash: true }) 
//   ],
//   exports: [RouterModule]
// })
export class AppRoutingModule { }
