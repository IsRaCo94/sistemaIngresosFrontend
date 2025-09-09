import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GastosRoutingModule } from './gastos-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { PrimeNgModules } from '../../../ngprime.modules';
import { AppCommonModule } from '../../../../app.common.module';
import { UpperDirective } from '../../../directive/upper.directive';
import { DetailComponent } from './detail/detail.component';

import { ProveedorModule } from "../shared/proveedor/proveedor.module";
import { CertificacionesModule } from "../shared/certificaciones/certificaciones.module";

@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    GastosRoutingModule,
    PrimeNgModules,
    AppCommonModule,
    UpperDirective,
    CertificacionesModule
]
})
export class GastosModule { }
