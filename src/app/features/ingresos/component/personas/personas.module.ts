import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonasRoutingModule } from './personas-routing.module';
import { AppCommonModule } from '../../../../app.common.module';
import { UpperDirective } from '../../../directive/upper.directive';
import { PersonasComponent } from './personas.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { PrimeNgModules } from '../../../ngprime.modules';
@NgModule({
  declarations: [

    PersonasComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    PersonasRoutingModule,
    AppCommonModule,
    UpperDirective,
    PrimeNgModules
  ]
})
export class PersonasModule { }
