import { Component, OnInit } from '@angular/core';
import { Rubros } from '../../../../models/rubros';
import { ingresos } from '../../../../models/ingresos';
import { ReportesIngresosService } from '../../../../service/reportes-ingresos.service';
import { DetalleRubrosService } from '../../../../service/detalle-rubros.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resumen-rubros',
  standalone: false,
  templateUrl: './resumen-rubros.component.html',
  styleUrl: './resumen-rubros.component.css'
})
export class ResumenRubrosComponent implements OnInit {
  public loading: boolean = false;
  submitted = false;
  nuevoIngreso = new ingresos();
    tipoRubros: Rubros[] = [];
    ingresos:ingresos[]=[]
    reporte: any;
    busqueda = {
    fechaInicio: '',
    fechaFin: '',
   
  }
constructor(private reporteService: ReportesIngresosService) { }
  ngOnInit(): void {
    this.intit();
    this.setVariablesIniciales();
  }

  intit() {
    this.nuevoIngreso.lugar = ''
  }
    setVariablesIniciales() {

    this.nuevoIngreso.lugar  
    this.busqueda.fechaFin = this.formatDate(new Date()).toString();
    this.busqueda.fechaInicio=  this.formatDate(new Date()).toString();
    console.log(this.busqueda.fechaInicio);
    console.log(this.busqueda.fechaFin);
    console.log('lugar',this.nuevoIngreso.lugar);
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
  
//  generarReporte() {
//   this.submitted = true;
//    const camposObligatorios = [
//      this.busqueda.fechaInicio,
//      this.busqueda.fechaFin,
    
     

//    ];
//      if (camposObligatorios.some(campo => !campo)) {
//        console.log(camposObligatorios);
//        Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
//        return;
//      }
   
//    this.loading = true;
//   let reportObservable: Observable<Blob>;
  
//   if (this.nuevoIngreso.lugar) {
//     reportObservable = this.reporteService.getReporteResumenlugarRubro(
//       this.busqueda.fechaInicio, 
//       this.busqueda.fechaFin, 
//       this.nuevoIngreso.lugar,
      
//     );
//   } else {
//     reportObservable = this.reporteService.getReporteResumenRubro(
//       this.busqueda.fechaInicio,
//       this.busqueda.fechaFin,
     
//     );
//   }

//   reportObservable.subscribe(blob => {
//     const url = window.URL.createObjectURL(blob);
//     window.open(url, '_blank');
//     setTimeout(() => {
//       window.URL.revokeObjectURL(url);
//     }, 10000);
//     this.loading = false;
//   }, error => {
//     console.error('Error generating report:', error);
//     this.loading = false;
//   });

//   console.log(this.busqueda.fechaInicio);
//   console.log(this.busqueda.fechaFin);
//   console.log('lugar',this.nuevoIngreso.lugar);

// }
generarReporte() {
  const camposObligatorios = [
    this.busqueda.fechaInicio,
    this.busqueda.fechaFin,
    //this.nuevoIngreso.lugar,
   // this.nuevoIngreso.nombre
  ];

  if (camposObligatorios.some(campo => !campo)) {
    Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
    return;
  }

  Swal.fire({
    title: 'Seleccione una opción:',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Descargar',
    denyButtonText: 'Vista Previa',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed || result.isDenied) {
      this.submitted = true;
        this.loading = true;
      
      let reportObservable: Observable<Blob>;
      
      if (this.nuevoIngreso.lugar) {
        
        reportObservable = this.reporteService.getReporteResumenlugarRubro(
          this.busqueda.fechaInicio, 
          this.busqueda.fechaFin, 
          this.nuevoIngreso.lugar
        );
      } else {
        
        reportObservable = this.reporteService.getReporteResumenRubro(
          this.busqueda.fechaInicio,
          this.busqueda.fechaFin
         
        );
      }
      
      reportObservable.subscribe(
        
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
        this.loading = false;
          if (result.isConfirmed) {
            const link = document.createElement('a');
            link.href = url;
            link.download = this.nuevoIngreso.nombre ? 'reporte_por_lugar_resumen.pdf' : 'reporte_remumen.pdf';
            document.body.appendChild(link);
            link.click();
           
            // Cleanup
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              document.body.removeChild(link);
              this.loading = false;
            }, 100);
          } else if (result.isDenied) {
            window.open(url, '_blank');
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              this.loading = false;
            }, 10000);
          }
        },
        error => {
          console.error('Error generating report:', error);
          Swal.fire('Error', 'No se pudo generar el reporte', 'error');
          this.loading = false;
        }
      );
    }
  });
}
exportExcel() {
    const camposObligatorios = [
      this.busqueda.fechaInicio,
      this.busqueda.fechaFin,
      //this.nuevoIngreso.lugar,
     // this.nuevoIngreso.nombre
    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
      return;
    }

    this.submitted = true;
    this.loading = true;
    let reportObservable: Observable<Blob>;

    if (this.nuevoIngreso.lugar) {
      reportObservable = this.reporteService.getReportePorLugarResumenExcel(
        this.busqueda.fechaInicio,
        this.busqueda.fechaFin,
        this.nuevoIngreso.lugar
      );
    } else {
      reportObservable = this.reporteService.getReporteResumenRubroExcel(
        this.busqueda.fechaInicio,
        this.busqueda.fechaFin

      );
    }

    reportObservable.subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.nuevoIngreso.lugar ?
          'reporte_resumen_por_lugar_rubro.xlsx' :
          'reporte_resumen_rubro.xlsx';
        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
          this.loading = false;
        }, 100);
      },
      error => {
        console.error('Error generating report:', error);
        Swal.fire('Error', 'No se pudo generar el reporte', 'error');
        this.loading = false;
      }
    );
  }

}
