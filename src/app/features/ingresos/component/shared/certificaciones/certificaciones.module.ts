import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificacionesComponent } from './certificaciones.component';
import { AppCommonModule } from '../../../../../app.common.module';



@NgModule({
  declarations: [
    CertificacionesComponent
  ],
  imports: [
     CommonModule,
        AppCommonModule
  ],
  exports:[CertificacionesComponent]
})
export class CertificacionesModule { }
