import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GastosComponent } from './gastos.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
   {
      path:'',
      component: GastosComponent
    },
    {
      path:'create',
      component:CreateComponent
    },
    {
      path:'edit/:id_gasto',
      component:EditComponent
    },
    {
      path:'detail/:id_gasto',
      component:DetailComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastosRoutingModule { }
