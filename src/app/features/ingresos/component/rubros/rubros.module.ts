import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RubrosRoutingModule } from './rubros-routing.module';
import { RubrosComponent } from './rubros.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { AppCommonModule } from '../../../../app.common.module';
import { UpperDirective } from '../../../directive/upper.directive';
import { PrimeNgModules } from '../../../ngprime.modules';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
   
    CreateComponent,
    EditComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    RubrosRoutingModule,
    AppCommonModule,
    UpperDirective,
    PrimeNgModules
  ]
})
export class RubrosModule { }
