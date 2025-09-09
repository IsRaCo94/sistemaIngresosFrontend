import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngresosComponent } from './ingresos.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { TiposRubrosComponent } from './component/report/tipos-rubros/tipos-rubros.component';
import { TiposIngresosComponent } from './component/report/tipos-ingresos/tipos-ingresos.component';
import { InformeDiarioComponent } from './component/report/informe-diario/informe-diario.component';
import { ResumenRubrosComponent } from './component/report/resumen-rubros/resumen-rubros.component';
import { TiposEmisionComponent } from './component/report/tipos-emision/tipos-emision.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '', component: IngresosComponent,
    children: [{
      path: '', redirectTo: 'dashboard', pathMatch: 'full'
    },  // Redirect to dashboard
    { path: 'dashboard', component: DashboardComponent },
    {
      path: 'personas',
      loadChildren: () => import('./component/personas/personas.module').then(m => m.PersonasModule)
    },
    {
      path: 'empresas',
      loadChildren: () => import('./component/empresas/empresas.module').then(m => m.EmpresasModule)
    },
    {
      path: 'cuentas',
      loadChildren: () => import('./component/cuentas/cuentas.module').then(m => m.CuentasModule)
    },
    {
      path: 'reg-ingresos',
      loadChildren: () => import('./component/reg-ingresos/reg-ingresos.module').then(m => m.RegIngresosModule)
    },
    {
      path: 'reg-egresos',
      loadChildren: () => import('./component/reg-egresos/reg-egresos.module').then(m => m.RegEgresosModule)

    },
    {
      path: 'gastos',
      loadChildren: () => import('./component/gastos/gastos.module').then(m => m.GastosModule)
    },
    {
      path: 'libreta',
      loadChildren: () => import('./component/libreta/libreta.module').then(m => m.LibretaModule)
    },
    {
      path: 'rubros',
      loadChildren: () => import('./component/rubros/rubros.module').then(m => m.RubrosModule)
    },
    {
      path: 'tipos-ingresos',
      component: TiposIngresosComponent
    },
    {
      path: 'tipos-rubros',
      component: TiposRubrosComponent
    },
    {
      path: 'informe-diario',
      component: InformeDiarioComponent
    },
    {
      path: 'resumen-rubros',
      component: ResumenRubrosComponent
    },
    {
      path: 'tipos-emision',
      component: TiposEmisionComponent
    }


    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosRoutingModule { }
