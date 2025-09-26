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
    const camposObligatorios = [
      this.busqueda.fechaInicio,
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
        
          reportObservable = this.reporteService.getReporteDiariolugar(
            this.busqueda.fechaInicio, 
            this.nuevoIngreso.lugar
          );
        } else {
          
          reportObservable = this.reporteService.getReporteDiario(
            this.busqueda.fechaInicio,
           
          );
        }
        reportObservable.subscribe(
          
          (blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
          this.loading = false;
            if (result.isConfirmed) {
              const link = document.createElement('a');
              link.href = url;
              link.download = this.nuevoIngreso.nombre ? 'reporte_diario_lugar.pdf' : 'reporte_diario.pdf';
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
      reportObservable = this.reporteService.getReporteDiariolugarExcel(
        this.busqueda.fechaInicio,
        this.nuevoIngreso.lugar,
       
      );
    } else {
      reportObservable = this.reporteService.getReporteDiarioExcel(
        this.busqueda.fechaInicio,
      );
    }

    reportObservable.subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.nuevoIngreso.nombre ?
          'reporte_diario_lugar.xlsx' :
          'reporte_diario.xlsx';
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
