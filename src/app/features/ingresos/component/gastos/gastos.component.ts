import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Gastos } from '../../../models/gastos';
import { Router } from '@angular/router';
import { GastosService } from '../../../service/gastos.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gastos',
  standalone: false,
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.css'
})
export class GastosComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  dtOptions: any = {};
  public loading: boolean = false;
  gastosFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  isLoadingUpdate = false;

   titulosColumnas = [
    'ENTIDAD',
    'UNIDAD',
    'FECHA DE ELABORACION',
    'N° DE PREVENTIVO',
    'N° DE COMPROMISO',
    'N° DE DEVENGADO',
    'N° DE PAGO',
    'N° DE SECUENCIA',
    'GLOSA',
    'ESTADO',
    'ACCION'
  ];
  
  gasto: any[] = [];
  gastos = new Gastos();
  constructor(
  private router: Router,
  private gastosService: GastosService
){}
  
  ngOnInit(): void {
     this.dtOptions = {
      responsive: true,
      order: [[1, 'desc']],
      columnDefs: [{
        width: "300px",
        targets: 0
      },
      {
        width: "300px",
        targets: 1
      },
      {
        width: "100px",
        targets: 2
      },
      {
        width: "100px",
        targets: 3
      },
      {
        width: "100px",
        targets: 4
      },
      {
        width: "100px",
        targets: 5
      },
      {
        width: "100px",
        targets: 6
      },
      {
        width: "100px",
        targets: 7
      },
      {
        width: "300px",
        targets: 8
      },
       {
        width: "100px",
        targets: 9
      },
      {
        width: "400px",
        targets: 10
      },
   
   ],
    
      language: {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrar _MENU_ Entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar:",
        "zeroRecords": "Sin resultados encontrados",
        "paginate": {
          "first": "Primero",
          "last": "Ultimo",
          "next": "Siguiente",
          "previous": "Anterior"
        }
      }
    };
    this.cargar_tabla();
}

  editarRegistro(gastos: Gastos) {
    this.router.navigateByUrl(`/ingresos/gastos/edit/${gastos}`);
  }
  detalleRegistro(gastos: Gastos) {
    this.router.navigateByUrl(`/ingresos/gastos/detail/${gastos}`);
  }
public cargar_tabla(){
    this.loading=true;
    this.gasto=[]
    this.gastosService.getGastos().subscribe(
      gast=>{
        this.gasto=gast
        this.loading=false;
      }); 
  }

   eliminarRegistro(id_gasto: number): void {
      Swal.fire({
        title: '¿Está seguro?',
        text: '¡Esta acción marcará el registro como inactivo y no se podrá recuperar fácilmente!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          this.gastosService.deleteGastos(id_gasto).subscribe({
            next: () => {
              this.isLoading = false;
              this.gastos.baja = false
              Swal.fire('¡Eliminado!', 'El registro ha sido dado de baja.', 'success');
              this.cargar_tabla();
            },
            error: (error: HttpErrorResponse) => {
              this.isLoading = false;
              console.error('Error al dar de baja el registro:', error);
              if (error.status === 404) {
                Swal.fire('No Encontrado', error.error?.message || 'El registro no fue encontrado o ya estaba dado de baja.', 'error');
              } else if (error.status === 400) { // Add this if you suspect validation errors for the ID
                Swal.fire('Error de Petición', error.error?.message || 'La solicitud no es válida. Verifique el ID.', 'error');
              }
              else {
                Swal.fire('Error', 'No se pudo dar de baja el registro. Por favor, intente de nuevo.', 'error');
              }
            }
          });
        }
      });
    }
}
