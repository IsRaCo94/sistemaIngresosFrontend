import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorComponent } from './shared/error/error.component';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule
    ],

})
export class AppCommonModule {

}