import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportarDocumentoComponent } from './importar-documento.component';
import { AppCommonModule } from '../../../../../app.common.module';



@NgModule({
  declarations: [
    ImportarDocumentoComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule
  ],
  exports: [
    ImportarDocumentoComponent
  ]
})
export class ImportarDocumentoModule { }
