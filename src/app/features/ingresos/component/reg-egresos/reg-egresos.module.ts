import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegEgresosRoutingModule } from './reg-egresos-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { AppCommonModule } from '../../../../app.common.module';
import { UpperDirective } from '../../../directive/upper.directive';
import { ProveedorModule } from '../shared/proveedor/proveedor.module';
import { ImportDataModule } from '../shared/import-data/import-data.module';
import { PrimeNgModules } from '../../../ngprime.modules';
import { RegEgresosComponent } from './reg-egresos.component';


@NgModule({
  declarations: [
    RegEgresosComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RegEgresosRoutingModule,
    AppCommonModule,
    UpperDirective,
    ProveedorModule,
    ImportDataModule,
    PrimeNgModules
  ]
})
export class RegEgresosModule { }
