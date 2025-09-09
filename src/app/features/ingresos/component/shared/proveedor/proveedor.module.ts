import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorComponent } from './proveedor.component';
import { AppCommonModule } from '../../../../../app.common.module';


@NgModule({
  declarations: [
    ProveedorComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule
  ],
  exports:
  [
  ProveedorComponent
  ]
})
export class ProveedorModule { }
