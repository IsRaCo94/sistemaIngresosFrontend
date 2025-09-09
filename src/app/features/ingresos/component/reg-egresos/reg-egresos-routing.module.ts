import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegEgresosComponent } from './reg-egresos.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: RegEgresosComponent
  },
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'edit/:id_egresos',
    component: EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegEgresosRoutingModule { }
