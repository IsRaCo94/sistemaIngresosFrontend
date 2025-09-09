import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresasRoutingModule } from './empresas-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { AppCommonModule } from '../../../../app.common.module';
import { UpperDirective } from '../../../directive/upper.directive';
import { EmpresasComponent } from './empresas.component';
import { ImportDataModule } from '../shared/import-data/import-data.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeNgModules } from '../../../ngprime.modules';


@NgModule({
  declarations: [
    EmpresasComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    EmpresasRoutingModule,
    AppCommonModule,
    UpperDirective ,
    ImportDataModule,
    PrimeNgModules
    

 
  ]
})
export class EmpresasModule { }
