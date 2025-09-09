import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibretaRoutingModule } from './libreta-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { AppCommonModule } from '../../../../app.common.module';
import { UpperDirective } from '../../../directive/upper.directive';
import { PrimeNgModules } from '../../../ngprime.modules';
import { LibretaComponent } from './libreta.component';


@NgModule({
  declarations: [
    LibretaComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    LibretaRoutingModule,
    AppCommonModule,
    UpperDirective ,
    PrimeNgModules
  ]
})
export class LibretaModule { }
