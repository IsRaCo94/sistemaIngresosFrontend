import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibretaComponent } from './libreta.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
   {
      path:'',
      component:LibretaComponent
    },
    {
      path:'create',
      component:CreateComponent 
    },
    {
      path:'edit/:id_libreta',
      component: EditComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibretaRoutingModule { }
