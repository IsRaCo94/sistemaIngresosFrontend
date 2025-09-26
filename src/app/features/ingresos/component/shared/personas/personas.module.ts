import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonasComponent } from './personas.component';
import { AppCommonModule } from '../../../../../app.common.module';



@NgModule({
  declarations: [
    PersonasComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule
  ],
  exports:
  [
  PersonasComponent
  ]
})
export class PersonasModule { }
