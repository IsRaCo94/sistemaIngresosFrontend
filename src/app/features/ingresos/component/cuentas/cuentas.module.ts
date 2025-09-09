import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentasRoutingModule } from './cuentas-routing.module';
import { AppCommonModule } from '../../../../app.common.module';
import { UpperDirective } from '../../../directive/upper.directive';
import { CuentasComponent } from './cuentas.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { PrimeNgModules } from '../../../ngprime.modules';
@NgModule({
  declarations: [
   CuentasComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    CuentasRoutingModule,
    AppCommonModule,
    UpperDirective,
    PrimeNgModules
  ]
})
export class CuentasModule { }
