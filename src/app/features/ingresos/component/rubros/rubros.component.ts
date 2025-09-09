import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Rubros } from '../../../models/rubros';
import { RubrosService } from '../../../service/rubros.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-rubros',
  standalone: false,
  templateUrl: './rubros.component.html',
  styleUrl: './rubros.component.css'
})
export class RubrosComponent implements OnInit {
dtOptions: any = {};
  public loading: boolean = true;
  personaFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  isLoadingUpdate = false;
   titulosColumnas = [
    'NUMERO DE RUBRO',
    'NOMBRE',
    'ENTIDAD',
    'ACCIONES',
  ];
  rubro: any[] = [];
  rubros = new Rubros();

  constructor(
    private router: Router,
    private rubroService: RubrosService
  ) { }

 ngOnInit(): void {
     this.dtOptions = {
      responsive: true,
      order: [[1, 'desc']],
      columnDefs: [{
        width: "600px",
        targets: 0
      },
      {
        width: "800px",
        targets: 1
      },
      {
        width: "200px",
        targets: 2
      },
         {
        width: "200px",
        targets: 3
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
      editarRegistro(rubros: Rubros) {
  
      this.router.navigateByUrl(`ingresos/rubros/edit/${rubros}`);
    }
     detalleRegistro(rubros: Rubros) {
        this.router.navigateByUrl(`/ingresos/rubros/detail/${rubros}`);
      }
  public cargar_tabla() {
    this.loading = true;
    this.rubro = []
    this.rubroService.getRubros().subscribe(
      rub => {
        this.rubro = rub
        this.loading = false;
      });
  }
  eliminarRegistro(id_tipo_rubro: number): void {
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
        this.rubroService.deleteRubros(id_tipo_rubro).subscribe({
          next: () => {
            this.isLoading = false;
            this.rubros.baja = false
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
