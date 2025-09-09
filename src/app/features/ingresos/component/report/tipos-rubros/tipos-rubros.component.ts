import { Component, OnInit } from '@angular/core';
import { TipoIngreso } from '../../../../models/TipoIngreso';
import { ingresos } from '../../../../models/ingresos';
import { ReportesIngresosService } from '../../../../service/reportes-ingresos.service';
import { IngresosService } from '../../../../service/ingresos.service';
import { Observable } from 'rxjs';
import { DetalleRubrosService } from '../../../../service/detalle-rubros.service';
import { RubrosDetalle } from '../../../../models/rubrosDetalle';
import { Rubros } from '../../../../models/rubros';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos-rubros',
  standalone: false,
  templateUrl: './tipos-rubros.component.html',
  styleUrl: './tipos-rubros.component.css'
})
export class TiposRubrosComponent implements OnInit {
  public loading: boolean = false;
  submitted= false;
  nuevoIngreso = new ingresos();
    tipoRubros: Rubros[] = [];
    ingresos:ingresos[]=[]
    reporte: any;
    busqueda = {
    fechaInicio: '',
    fechaFin: ''
  }
constructor(private reporteService: ReportesIngresosService,
            private rubrosService: DetalleRubrosService,) { }
  ngOnInit(): void {
    this.init();
    this.getRubro();
    this.setVariablesIniciales();
  }

    setVariablesIniciales() {
 
    this.nuevoIngreso.tipo_ingres  
    this.busqueda.fechaFin = this.formatDate(new Date()).toString();
    this.busqueda.fechaInicio=  this.formatDate(new Date()).toString();
    console.log(this.busqueda.fechaInicio);
    console.log(this.busqueda.fechaFin);
    console.log(this.nuevoIngreso.tipo_ingres);
  }

  init(){
     this.nuevoIngreso.id_tipo_rubro = '';
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
  
      getRubro() {
    this.rubrosService.getRubros()
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            this.tipoRubros = response;
          }
        },
        error => console.log(<any>error));
  }


  getTipoRubroChange(id_rubro: any) {
    const tipos = this.tipoRubros.find(x => x.id_tipo_rubro == id_rubro);
    if (tipos && tipos.nombre && tipos.nombre.length > 0) {
      this.nuevoIngreso.id_tipo_rubro = tipos.id_tipo_rubro;
      this.nuevoIngreso.nombre = tipos.nombre;
      this.nuevoIngreso.nombre = tipos.nombre;
      this.nuevoIngreso.nombre = tipos.nombre;
      this.nuevoIngreso.num_rubro = tipos.num_rubro;

    } else {
      this.nuevoIngreso.id_tipo_rubro = '';
      this.nuevoIngreso.nombre = '';
      //this.nuevoIngreso.nombre = 'TODOS LOS RUBROS';
     
    }
    console.log('Rubro seleccionado:', this.nuevoIngreso.nombre);
  }

//  generarReporte() {
//    const camposObligatorios = [
//        this.busqueda.fechaInicio,
//        this.busqueda.fechaFin,
//        this.nuevoIngreso.lugar,
//        //this.nuevoIngreso.nombre,
   
  
//      ];
//        if (camposObligatorios.some(campo => !campo)) {
//          console.log(camposObligatorios);
//          Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
//          return;
//        }
//      this.submitted = true;
//      this.loading = true;

// if (!this.busqueda.fechaInicio || !this.busqueda.fechaFin) {
//   Swal.fire({
//     title: 'Fechas requeridas',
//     text: 'Por favor ingrese ambas fechas para generar el reporte',
//     icon: 'warning',
//     confirmButtonText: 'Entendido'
//   });
//   return;
// }
//   let reportObservable: Observable<Blob>;
  
//   if (this.nuevoIngreso.nombre) {
//     reportObservable = this.reporteService.getReportePorTipoRubro(
//       this.busqueda.fechaInicio, 
//       this.busqueda.fechaFin, 
//       this.nuevoIngreso.nombre,
//       this.nuevoIngreso.lugar
      
//     );
//   } else {
//     reportObservable = this.reporteService.getReporteTipoRubro(
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

//   console.log(this.busqueda.fechaInicio);
//   console.log(this.busqueda.fechaFin);
//   console.log(this.nuevoIngreso.tipo_ingres);
// }
generarReporte() {
  const camposObligatorios = [
    this.busqueda.fechaInicio,
    this.busqueda.fechaFin,
    this.nuevoIngreso.lugar,
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
      
      if (this.nuevoIngreso.nombre) {
        reportObservable = this.reporteService.getReportePorTipoRubro(
          this.busqueda.fechaInicio,
          this.busqueda.fechaFin,
           this.nuevoIngreso.nombre,
          this.nuevoIngreso.lugar
        
        );
      } else {
        
        reportObservable = this.reporteService.getReporteTipoRubro(
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
            link.download = this.nuevoIngreso.nombre ? 'reporte_por_tipo_rubro.pdf' : 'reporte_tipo_rubro.pdf';
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
      this.nuevoIngreso.lugar,
     // this.nuevoIngreso.nombre
    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Para generar el reporte, por favor, complete todos los campos requeridos.', 'warning');
      return;
    }

    this.submitted = true;
    this.loading = true;
    let reportObservable: Observable<Blob>;

    if (this.nuevoIngreso.nombre) {
      reportObservable = this.reporteService.getReportePorTipoRubroExcel(
        this.busqueda.fechaInicio,
        this.busqueda.fechaFin,
        this.nuevoIngreso.nombre,
        this.nuevoIngreso.lugar
      );
    } else {
      reportObservable = this.reporteService.getReporteTipoRubroExcel(
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
        link.download = this.nuevoIngreso.nombre ?
          'reporte_por_tipo_rubro.xlsx' :
          'reporte_tipo_rubro.xlsx';
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
