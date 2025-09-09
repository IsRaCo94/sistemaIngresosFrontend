import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RubrosComponent } from './rubros.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path:'',
    component:RubrosComponent
  },
  {
    path:'create',
    component:CreateComponent
  },
  {
    path:'edit/:id_tipo_rubro',
    component:EditComponent
  },
  {
    path:'detail/:id_tipo_rubro',
    component:DetailComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubrosRoutingModule { }
