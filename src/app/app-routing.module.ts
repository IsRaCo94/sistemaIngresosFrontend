import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'ingresos',
    pathMatch: 'full'
  },
  {
    path:'',
    component: LayoutComponent,
    children: [
  
      {
        path: 'ingresos',
        loadChildren:()=> import('./features/ingresos/ingresos.module').then(m=>m.IngresosModule)
      }
    ]

  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
