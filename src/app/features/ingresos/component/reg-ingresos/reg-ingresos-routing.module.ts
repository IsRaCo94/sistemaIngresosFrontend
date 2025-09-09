import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegIngresosComponent } from './reg-ingresos.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path:'',
    component: RegIngresosComponent
  },
  {
    path:'create',
    component:CreateComponent
  },
  {
    path:'edit/:id_ingresos',
    component:EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegIngresosRoutingModule { }
