import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarComponent implements OnInit {
  constructor(private router: Router) {

  }
  ngOnInit(): void {
  }
  onMenuClick(menu: string, title: string) {
    this.router.navigate(['/ingresos/' + menu]);
  }
   menudespegable = false;
   reportesDespegable = false;
   ingresosDespegable = false;
   gastosDespegable = false;

  toggle() {
    this.menudespegable = !this.menudespegable;
  }
  toggleReportes() {
    this.reportesDespegable = !this.reportesDespegable;
  }
  toggleIngresos(){
    this.ingresosDespegable = !this.ingresosDespegable;
  }
  toggleGastos(){
    this.gastosDespegable = !this.gastosDespegable;
  }
}
