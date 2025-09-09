import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportDataComponent } from './import-data.component';
import { AppCommonModule } from '../../../../../app.common.module';



@NgModule({
  declarations: [
    ImportDataComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule
  ],
  exports:
    [
      ImportDataComponent
    ]
})
export class ImportDataModule { }
