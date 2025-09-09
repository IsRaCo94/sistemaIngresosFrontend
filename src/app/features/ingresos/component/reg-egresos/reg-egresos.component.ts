import { Component, OnInit, ViewChild } from '@angular/core';
import { egresos } from '../../../models/egresos';
import { FormGroup } from '@angular/forms';
import { EgresosService } from '../../../service/egresos.service';
import { Router } from '@angular/router';
import { empresa } from '../../../models/empresa';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-reg-egresos',
  standalone: false,
  templateUrl: './reg-egresos.component.html',
  styleUrl: './reg-egresos.component.css'
})
export class RegEgresosComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  dtOptions: any = {};
  public loading: boolean = true;
  detalleFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  isLoadingUpdate = false;
  
  titulosColumnas = [
    'CODIGO',
    'NRO. CHEQUE',
    'LUGAR',
    'FECHA',
    'MONTO',
    'CODIGO PROVEEDOR',
    'PROVEEDOR',
    'OBSERVACION',
    'ESTADO',
    'FECHA COBRO',
    'COBRADO',
    'CERRADO',
    'ACCION'
  ];
  egreso: any[] = [];
  egresos = new egresos();

  constructor(
    private router: Router,
    private egresosService: EgresosService
  ) { }
   ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      order: [[1, 'desc']],
      columnDefs: [{
        width: "100px",
        targets: 0
      },
      {
        width: "200px",
        targets: 1
      },
      {
        width: "100px",
        targets: 2
      },
      {
        width: "200px",
        targets: 3
      },
      {
        width: "200px",
        targets: 4
      },
      {
        width: "200px",
        targets: 5
      },
      {
        width: "200px",
        targets: 6
      },
      {
        width: "100px",
        targets: 7
      },
      {
        width: "100px",
        targets: 8
      },
      {
        width: "200px",
        targets: 9
      },
      {
        width: "100px",
        targets: 10
      },
      {
        width: "100px",
        targets: 11
      },
      {
        width: "200px",
        targets: 12
      }
        
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
  editarRegistro(egresos: egresos) {

    this.router.navigateByUrl(`/ingresos/reg-egresos/edit/${egresos}`);
  }

  public cargar_tabla(){
    this.loading=true;
    this.egreso=[]
    this.egresosService.getEgresos().subscribe(
      ingr=>{
        this.egreso=ingr
        this.loading=false;
      });
  }

   eliminarRegistro(id_ingresos: number): void {
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
          this.egresosService.deleteEgresos(id_ingresos).subscribe({
            next: () => {
              this.isLoading = false;
              this.egresos.baja = false
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
