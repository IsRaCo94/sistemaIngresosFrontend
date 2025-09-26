import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegIngresosRoutingModule } from './reg-ingresos-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { AppCommonModule } from '../../../../app.common.module';
import { UpperDirective } from '../../../directive/upper.directive';
import { RegIngresosComponent } from './reg-ingresos.component';
import { ProveedorModule } from '../shared/proveedor/proveedor.module';
import { ImportDataModule } from "../shared/import-data/import-data.module";
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PrimeNgModules } from '../../../ngprime.modules';
import { PersonasModule } from "../shared/personas/personas.module";
import { ImportarDocumentoModule } from "../shared/importar-documento/importar-documento.module";

@NgModule({
  declarations: [
    RegIngresosComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    RegIngresosRoutingModule,
    AppCommonModule,
    UpperDirective,
    ProveedorModule,
    ImportDataModule,
    PrimeNgModules,
    PersonasModule,
    ImportarDocumentoModule
]
})
export class RegIngresosModule { }
