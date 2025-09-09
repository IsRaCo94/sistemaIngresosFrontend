import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RubrosDetalle } from '../../../../models/rubrosDetalle';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DetalleRubrosService } from '../../../../service/detalle-rubros.service';
import { RubrosService } from '../../../../service/rubros.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  detalleFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  isLoadingUpdate = false;
  buttonUpdate = 'Actualizar';
  nuevoDetalle = new RubrosDetalle;

  @ViewChild('closebutton') closebutton: any;
  dtOptions: any = {};
  public loading: boolean = true;
  public VisibleAdd: boolean = true;
  public saveUpdate: boolean = true;
  public isAlert: boolean = false;
  public det: any[] = [];

  titulosColumnas = [
    'SERVICIO.',
    'ACCION'
  ];
  titleCard = '';
  constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private rutaActiva: ActivatedRoute,
    private detalleService: DetalleRubrosService,
    private rubrosService: RubrosService,
    private _location: Location) { }
  initDetalle(){
    this.nuevoDetalle.servicio
    this.nuevoDetalle.num_rubro
    this.nuevoDetalle.nombre
    const id_tipo_rubro = this.rutaActiva.snapshot.params['id_tipo_rubro'];
    this.nuevoDetalle.id_rubro_id = id_tipo_rubro;
    this.rubrosService.getRubrosUno(id_tipo_rubro).subscribe(rubro => {
      if (rubro) {
        this.nuevoDetalle.servicio = rubro.servicio;
        this.nuevoDetalle.num_rubro = rubro.num_rubro;
        this.nuevoDetalle.nombre = rubro.nombre;
  
      }else{
        this.nuevoDetalle.servicio = '';
        this.nuevoDetalle.num_rubro = '';
        this.nuevoDetalle.nombre = '';
      }
    });
  }
 ngOnInit(): void {
     this.dtOptions = {
      responsive: true,
      order: [[1, 'desc']],
      columnDefs: [{
        width: "1500px",
        targets: 0
      },
      {
        width: "100px",
        targets: 1
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
    this.detalleFormGroup = this._formBuilder.group({
      id_rubro_id: ['', Validators.required],
      id_detelle_rubro: ['', Validators.required],
      servicio: ['', Validators.required],
      baja: ['', Validators.required],
      num_rubro: ['', Validators.required],
      nombre: ['', Validators.required],

    })

     this.cargarDetalles();
}
  public cargarDetalles() {
    this.loading = true;
    this.det = [];
    const id_tipo_rubro = Number(this.rutaActiva.snapshot.params['id_tipo_rubro']);
    this.detalleService.getDetRubros().subscribe(rub => {
      console.log('DETALLES:', rub);
      this.det = rub.filter((nuevoDetalle: any) => nuevoDetalle.id_rubro_id === id_tipo_rubro);
      this.rutaActiva.snapshot.params['id_detalle_rubro'];
      this.loading = false;
    });

  }

  addDet() {
    this.VisibleAdd = false
    this.isLoading = false
    this.initDetalle();
    this.titleCard = 'REGISTRO DETALLE SERVICIOS';
    this.saveUpdate = true;
    this.isAlert = false;

  }
    updateDet(nuevoDetalle: RubrosDetalle) {
    this.VisibleAdd = false
    this.isLoading = false
    this.submitted = true;
    this.nuevoDetalle = nuevoDetalle
    this.titleCard = 'MODIFICACION DE REGISTRO'
    this.saveUpdate = false
    this.isAlert = false

  }
   cancelAddDet() {
    this.VisibleAdd = true
    //this.cargarDetalles();
  }
    goBack() {
    this._location.back();
  }

  guardarRegistro(){
    
    console.log(this.nuevoDetalle);
    this.isLoading = true;
    this.button = 'Procesando..';
   this.detalleService.postDetRubro(this.nuevoDetalle)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.button = 'Guardar';
          Swal.fire('Registro Exitoso', res.message || 'El egreso se registró correctamente.', 'success');
          this.cargarDetalles();  // Reload data after successful save
          this.addDet();

          // this.VisibleAdd = true;  // Return to list view after save
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.button = 'Guardar';
          console.error('Error al guardar registro:', error);
          if (error.status === 500) {
            const errorMessage = error.error?.message || 'El código ingresado ya existe. Por favor, intente con otro.';
            Swal.fire('Advertencia', errorMessage, 'warning');
          } else if (error.status === 400) {
            const errorMessage = error.error?.message || 'Datos de la solicitud inválidos. Por favor, verifique la información.';
            Swal.fire('Error de Datos', errorMessage, 'error');
          } else {
            Swal.fire('Error', 'Ocurrió un error inesperado al intentar guardar el registro. Por favor, intente de nuevo.', 'error');
          }
        }
      });
  }
actualizarRegistro() {
    this.isLoadingUpdate = true;
    this.button = 'Procesando..';

    const id_detalle_rubro = this.nuevoDetalle.id_detalle_rubro;
    if (!id_detalle_rubro) {
      this.isLoadingUpdate = false;
      this.button = 'Actualizar';
      Swal.fire('Error', 'ID de detalle no encontrado. No se puede actualizar.', 'error');
      return;
    }

    this.detalleService.updateDetRubro(this.nuevoDetalle, id_detalle_rubro.toString())
      .subscribe({
        next: (res: any) => {
          this.isLoadingUpdate = false;
          this.button = 'Actualizar';
          Swal.fire('Registro Exitoso', res.message || 'El egreso se registró correctamente.', 'success');
          this.cancelAddDet();  // Reload data after successful save
          this.cargarDetalles();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoadingUpdate = false;
          this.button = 'Actualizar';
          console.error('Error al actualizar registro:', error);
          if (error.status === 500) {
            const errorMessage = error.error?.message || 'El código ingresado ya existe. Por favor, intente con otro.';
            Swal.fire('Advertencia', errorMessage, 'warning');
          } else if (error.status === 400) {
            const errorMessage = error.error?.message || 'Datos de la solicitud inválidos. Por favor, verifique la información.';
            Swal.fire('Error de Datos', errorMessage, 'error');
          } else {
            Swal.fire('Error', 'Ocurrió un error inesperado al intentar guardar el registro. Por favor, intente de nuevo.', 'error');
          }
        }
      });
  }


  eliminarDetalle(id_detalle_rubro: number | number): void {

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
        this.detalleService.deleteDetRubro(id_detalle_rubro).subscribe({
          next: () => {
            this.isLoading = false;
            this.nuevoDetalle.baja = false
            this.cancelAddDet();  // Reload data after successful save
            this.cargarDetalles();
            Swal.fire('¡Eliminado!', 'El registro ha sido dado de baja.', 'success');
            //this.cargarDetalles();
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