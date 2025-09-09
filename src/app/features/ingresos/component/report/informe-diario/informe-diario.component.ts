import { Component, OnInit } from '@angular/core';
import { IngresosService } from '../../../../service/ingresos.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ingresos } from '../../../../models/ingresos';
@Component({
  selector: 'app-informe-diario',
  standalone: false,
  templateUrl: './informe-diario.component.html',
  styleUrl: './informe-diario.component.css'
})
export class InformeDiarioComponent implements OnInit {
  public loading: boolean = false;
  submitted = false;
   nuevoIngreso = new ingresos();
  busqueda = {
    fechaInicio: '',
      lugar: '',
  }

  constructor(
    private reporteService: IngresosService
  ) { }
  setVariablesIniciales() {

    this.busqueda.fechaInicio = this.formatDate(new Date()).toString();
  }
   formatDate(date: any): String {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-'); // Changed to yyyy-MM-dd format
}
  ngOnInit(): void {
    this.setVariablesIniciales();
  }
 generarReporte() {
      this.submitted = true;
    const camposObligatorios = [
        this.busqueda.fechaInicio,
      ];
        if (camposObligatorios.some(campo => !campo)) {
          console.log(camposObligatorios);
          Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
          return;
        }

      this.loading = true;
  let reportObservable: Observable<Blob>;
    reportObservable = this.reporteService.getReporteDiario(
      this.busqueda.fechaInicio,
  
  
  
    );
  reportObservable.subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 10000);
    this.loading = false;
  }, error => {
    console.error('Error generating report:', error);
     this.loading = false; 
  });

  console.log(this.busqueda.fechaInicio);

}
}
