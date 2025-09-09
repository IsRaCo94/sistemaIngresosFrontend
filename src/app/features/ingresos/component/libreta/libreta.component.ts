import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Libreta } from '../../../models/libreta';
import { LibretaService } from '../../../service/libreta.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-libreta',
  standalone: false,
  templateUrl: './libreta.component.html',
  styleUrl: './libreta.component.css'
})
export class LibretaComponent implements OnInit {
 @ViewChild('closebutton') closebutton: any;
  dtOptions: any = {};
  public loading: boolean = true;
  libretaFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  isLoadingUpdate = false;
   titulosColumnas = [
    'LIBRETA',
    'DESCRIPCION LIBRETA',
    'DESCRIPCION CORTA LIBRETA',
    'ACCIONES'
  ];
    libreta:any[]=[]
    libretas=new Libreta
  constructor(
  private router: Router,
  private libretaServive: LibretaService
){}

  ngOnInit(): void {
     this.dtOptions = {
      responsive: true,
      order: [[1, 'desc']],
      columnDefs: [{
        width: "500px",
        targets: 0
      },
      {
        width: "600px",
        targets: 1
      },
      {
        width: "600px",
        targets: 2
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
    editarRegistro(libretas: Libreta) {

    this.router.navigateByUrl(`ingresos/libreta/edit/${libretas}`);
  }
  public cargar_tabla() {
    this.loading = true;
    this.libreta = []
    this.libretaServive.getLibreta().subscribe(
      libr => {
        this.libreta = libr
        this.loading = false;
      });
  }

  eliminarRegistro(id_libreta: number): void {
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
        this.libretaServive.deleteLibreta(id_libreta).subscribe({
          next: () => {
            this.isLoading = false;
            this.libretas.baja = false
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
