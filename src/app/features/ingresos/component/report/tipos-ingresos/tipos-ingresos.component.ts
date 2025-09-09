import { Component, OnInit } from '@angular/core';
import { ingresos } from '../../../../models/ingresos';
import { ReportesIngresosService } from '../../../../service/reportes-ingresos.service';
import { IngresosService } from '../../../../service/ingresos.service';
import { TipoIngreso } from '../../../../models/TipoIngreso';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos-ingresos',
  standalone: false,
  templateUrl: './tipos-ingresos.component.html',
  styleUrl: './tipos-ingresos.component.css'
})
export class TiposIngresosComponent implements OnInit {

  public loading: boolean = false;
  submitted = false;
  nuevoIngreso = new ingresos();
  tipoIngresos: TipoIngreso[] = [];
  ingresos: ingresos[] = []
  reporte: any;
  busqueda = {
    reparticion: '',
    fechaInicio: '',
    fechaFin: '',
    lugar: '',
  }
  constructor(private reporteService: ReportesIngresosService,
    private tipoingresoService: IngresosService) { }
  ngOnInit(): void {
    this.init();
    this.getTipoIngreso();
    this.setVariablesIniciales();
  }
  init() {
    this.nuevoIngreso.id_tipo_ingr_id = '';

  }
  setVariablesIniciales() {

    this.nuevoIngreso.tipo_ingres
    this.nuevoIngreso.lugar
    this.busqueda.fechaFin = this.formatDate(new Date()).toString();
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

  getTipoIngreso() {
    this.tipoingresoService.getTipoIngreso()
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            this.tipoIngresos = response;
          }
        },
        error => console.log(<any>error));
  }
  getTipoIngresoChange(id_tipo_ingr: any) {
    const tipos = this.tipoIngresos.find(x => x.id_tipo_ingr == id_tipo_ingr);
    if (tipos && tipos.tipo_ingr && tipos.tipo_ingr.length > 0) {
      this.nuevoIngreso.id_tipo_ingr_id = tipos.id_tipo_ingr;
      this.nuevoIngreso.tipo_ingres = tipos.tipo_ingr;
    } else {
      this.nuevoIngreso.id_tipo_ingr_id = '';
      this.nuevoIngreso.tipo_ingres = '';
      //this.nuevoIngreso.tipo_ingres = 'TODOS LOS INGRESOS';
    }
  }
  // descargarReporte() {
  //   const camposObligatorios = [
  //     this.busqueda.fechaInicio,
  //     this.busqueda.fechaFin,
  //     this.nuevoIngreso.lugar
  //   ];

  //   if (camposObligatorios.some(campo => !campo)) {
  //     Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
  //     return;
  //   }

  //   this.submitted = true;
  //   this.loading = true;
  //   let reportObservable: Observable<Blob>;

  //   if (this.nuevoIngreso.tipo_ingres) {
  //     reportObservable = this.reporteService.getReportePorTipoIngreso(
  //       this.busqueda.fechaInicio, 
  //       this.busqueda.fechaFin, 
  //       this.nuevoIngreso.tipo_ingres,
  //       this.nuevoIngreso.lugar
  //     );
  //   } else {
  //     reportObservable = this.reporteService.getReporteTipoIngreso(
  //       this.busqueda.fechaInicio,
  //       this.busqueda.fechaFin,
  //       this.nuevoIngreso.lugar
  //     );
  //   }

  //   reportObservable.subscribe(
  //     (blob: Blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = this.nuevoIngreso.tipo_ingres ? 'reporte_por_tipo_ingreso.pdf' : 'reporte_tipo_ingreso.pdf';
  //       document.body.appendChild(link);
  //       link.click();

  //       // Cleanup
  //       setTimeout(() => {
  //         window.URL.revokeObjectURL(url);
  //         document.body.removeChild(link);
  //         this.loading = false;
  //       }, 100);
  //     },
  //     error => {
  //       console.error('Error generating report:', error);
  //       Swal.fire('Error', 'No se pudo generar el reporte', 'error');
  //       this.loading = false;
  //     }
  //   );
  // }
  //  generarReporte() {
  //   const camposObligatorios = [
  //     this.busqueda.fechaInicio,
  //     this.busqueda.fechaFin,
  //     this.nuevoIngreso.lugar,
  //     //this.nuevoIngreso.tipo_ingres
  //   ];
  //     if (camposObligatorios.some(campo => !campo)) {
  //       console.log(camposObligatorios);
  //       Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
  //       return;
  //     }
  //   this.submitted = true;
  //   this.loading = true;
  //   let reportObservable: Observable<Blob>;

  //   if (this.nuevoIngreso.tipo_ingres) {
  //     reportObservable = this.reporteService.getReportePorTipoIngreso(
  //       this.busqueda.fechaInicio, 
  //       this.busqueda.fechaFin, 
  //       this.nuevoIngreso.tipo_ingres,
  //       this.nuevoIngreso.lugar

  //     );
  //   } else {
  //     reportObservable = this.reporteService.getReporteTipoIngreso(
  //       this.busqueda.fechaInicio,
  //       this.busqueda.fechaFin,
  //       this.nuevoIngreso.lugar
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

  // }
  generarReporte() {
    const camposObligatorios = [
      this.busqueda.fechaInicio,
      this.busqueda.fechaFin,
      this.nuevoIngreso.lugar
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

        if (this.nuevoIngreso.tipo_ingres) {

          reportObservable = this.reporteService.getReportePorTipoIngreso(
            this.busqueda.fechaInicio,
            this.busqueda.fechaFin,
            this.nuevoIngreso.tipo_ingres,
            this.nuevoIngreso.lugar
          );
        } else {

          reportObservable = this.reporteService.getReporteTipoIngreso(
            this.busqueda.fechaInicio,
            this.busqueda.fechaFin,
            this.nuevoIngreso.lugar
          );
        }

        reportObservable.subscribe(

          (blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            this.loading = false;
            if (result.isConfirmed) {
              const link = document.createElement('a');
              link.href = url;
              link.download = this.nuevoIngreso.tipo_ingres ? 'reporte_por_tipo_ingreso.pdf' : 'reporte_tipo_ingreso.pdf';
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
      this.nuevoIngreso.lugar
    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
      return;
    }

    this.submitted = true;
    this.loading = true;
    let reportObservable: Observable<Blob>;

    if (this.nuevoIngreso.tipo_ingres) {
      reportObservable = this.reporteService.getReportePorTipoIngresoExcel(
        this.busqueda.fechaInicio,
        this.busqueda.fechaFin,
        this.nuevoIngreso.tipo_ingres,
        this.nuevoIngreso.lugar
      );
    } else {
      reportObservable = this.reporteService.getReporteTipoIngresoExcel(
        this.busqueda.fechaInicio,
        this.busqueda.fechaFin,
        this.nuevoIngreso.lugar
      );
    }

    reportObservable.subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.nuevoIngreso.tipo_ingres ?
          'reporte_por_tipo_ingreso.xlsx' :
          'reporte_tipo_ingreso.xlsx';
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

  descargarExcel(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_ingresos_${this.busqueda.fechaInicio}_a_${this.busqueda.fechaFin}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  // descargarReporte() {
  //   this.reporteService.getReporteTipoIngreso(this.busqueda.fechaInicio, this.busqueda.fechaFin, this.nuevoIngreso.lugar).subscribe(
  //     (data: Blob) => {
  //       // Crear URL del blob
  //       const url = window.URL.createObjectURL(data);

  //       // Crear enlace temporal
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = 'reporte_tipo_ingreso.pdf';

  //       // Descargar el archivo
  //       document.body.appendChild(link);
  //       link.click();

  //       // Limpiar
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(link);
  //     },
  //     error => {
  //       console.error('Error al descargar el reporte:', error);
  //       // Aquí puedes agregar manejo de errores
  //     }
  //   );
  // }

}