import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresosRoutingModule } from './ingresos-routing.module';
import { IngresosComponent } from './ingresos.component';
import { MainSidebarComponent } from './component/main-sidebar/main-sidebar.component';
import { AppCommonModule } from '../../app.common.module';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { PrimeNgModules } from '../ngprime.modules';
import { RegEgresosComponent } from './component/reg-egresos/reg-egresos.component';
import { GastosComponent } from './component/gastos/gastos.component';
import { LibretaComponent } from './component/libreta/libreta.component';
import { RubrosComponent } from './component/rubros/rubros.component';
import { TiposRubrosComponent } from './component/report/tipos-rubros/tipos-rubros.component';
import { TiposIngresosComponent } from './component/report/tipos-ingresos/tipos-ingresos.component';
import { InformeDiarioComponent } from './component/report/informe-diario/informe-diario.component';
import { ResumenRubrosComponent } from './component/report/resumen-rubros/resumen-rubros.component';
import { TiposEmisionComponent } from './component/report/tipos-emision/tipos-emision.component';



@NgModule({
  declarations: [
    IngresosComponent,
    MainSidebarComponent,
    DashboardComponent,
    GastosComponent,
    RubrosComponent,
    TiposRubrosComponent,
    TiposIngresosComponent,
    InformeDiarioComponent,
    ResumenRubrosComponent,
    TiposEmisionComponent


  ],
  imports: [
    CommonModule,
    IngresosRoutingModule,
    AppCommonModule,
    PrimeNgModules
  ]
})
export class IngresosModule { }
