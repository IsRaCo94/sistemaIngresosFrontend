import { Component, OnInit } from '@angular/core';
import { IngresosService } from '../../../../service/ingresos.service';
import { ingresos } from '../../../../models/ingresos';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ReportesIngresosService } from '../../../../service/reportes-ingresos.service';

@Component({
  selector: 'app-tipos-emision',
  standalone: false,
  templateUrl: './tipos-emision.component.html',
  styleUrl: './tipos-emision.component.css'
})
export class TiposEmisionComponent implements OnInit {
     
public loading: boolean = false;
  submitted = false;
   nuevoIngreso = new ingresos();
  busqueda = {
    fechaInicio: '',
    fechaFin: '',
      lugar: '',
  }

  constructor(
    private reporteService: ReportesIngresosService
  ) { }
  setVariablesIniciales() {

    this.busqueda.fechaInicio = this.formatDate(new Date()).toString();
    this.busqueda.fechaFin = this.formatDate(new Date()).toString();
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

  init() {
    this.nuevoIngreso.tipo_emision = '';
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
//     reportObservable = this.reporteService.getReporteResumenlugarEmision(
//       this.busqueda.fechaInicio, 
//       this.busqueda.fechaFin, 
//       this.nuevoIngreso.lugar,
//       this.nuevoIngreso.tipo_emision,

      
//     );
//   } else {
//     reportObservable = this.reporteService.getReporteResumenEmision(
//       this.busqueda.fechaInicio,
//       this.busqueda.fechaFin,
//       this.nuevoIngreso.tipo_emision,
     
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
//   console.log('emsion',this.nuevoIngreso.tipo_emision);

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
        reportObservable = this.reporteService.getReporteResumenlugarEmision(
          this.busqueda.fechaInicio,
          this.busqueda.fechaFin,
          this.nuevoIngreso.lugar,
          this.nuevoIngreso.tipo_emision
    
        );
      } else {
        
        reportObservable = this.reporteService.getReporteResumenEmision(
          this.busqueda.fechaInicio, 
          this.busqueda.fechaFin, 
          this.nuevoIngreso.tipo_emision
        );
      }
      
      reportObservable.subscribe(
        
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
        this.loading = false;
          if (result.isConfirmed) {
            const link = document.createElement('a');
            link.href = url;
            link.download = this.nuevoIngreso.nombre ? 'reporte_por_emision.pdf' : 'reporte_tipo_emision.pdf';
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
       
        }
      );
    }
  });
}
  exportExcel() {
    const camposObligatorios = [
      this.busqueda.fechaInicio,
      this.busqueda.fechaFin,
     // this.nuevoIngreso.lugar,
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
      reportObservable = this.reporteService.getReportePorLugarEmisionExcel(
        this.busqueda.fechaInicio,
        this.busqueda.fechaFin,
        this.nuevoIngreso.lugar,
        this.nuevoIngreso.tipo_emision
      );
    } else {
      reportObservable = this.reporteService.getReporteEmisionExcel(
        this.busqueda.fechaInicio,
        this.busqueda.fechaFin,
        this.nuevoIngreso.tipo_emision
      );
    }

    reportObservable.subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.nuevoIngreso.nombre ?
          'reporte_tipo_emision.xlsx' :
          'reporte_por_emision.xlsx';
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
