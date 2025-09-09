import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GastoDetalle } from '../../../../models/gastoDetalle';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DetalleGastoService } from '../../../../service/detalle-gasto.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Certificacion } from '../../../../models/certificacion';
import { Gastos } from '../../../../models/gastos';
import { GastosService } from '../../../../service/gastos.service';

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
  nuevoDetalle = new GastoDetalle;


  @ViewChild('closebutton') closebutton: any;
  dtOptions: any = {};
  public loading: boolean = true;
  public VisibleAdd: boolean = true;
  public saveUpdate: boolean = true;
  public isAlert: boolean = false;
  public det: any[] = [];

  titulosColumnas = [
    'N° DE CERT.',
    'AREA ORG.',
    'DESCRIPCION ESPECIFICA',
    'OPERACIONES',
    'COSTO TOTAL',
    'SALDO',
    'SALDO FINAL',
    'ACCION'
  ];
  total = {
    registros: 0,
    importe: 0
  }
  titleCard = '';
  //public det: any[] = [];
  //detalles = new GastoDetalle();
  certificaciones: Certificacion[] = [];
  gastos: Gastos[] = [];
  selectedItem: any;
  initDetalle() {
    this.nuevoDetalle.area_organizacional = '';
    this.nuevoDetalle.descripcionEspecificaRequerimientos = '';
    this.nuevoDetalle.operaciones = '';
    this.nuevoDetalle.nota_solicitud = '';
    this.nuevoDetalle.numeroCertificacion = '';
    this.nuevoDetalle.tareas = '';
    this.nuevoDetalle.descripcion = '';
    this.nuevoDetalle.catProg = '';
    this.nuevoDetalle.partida = '';
    // this.nuevoDetalle.cantidad = 0;
    // this.nuevoDetalle.precioUnitario = 0;
    this.nuevoDetalle.costoTotal = 0;
    this.nuevoDetalle.ejecutado = 0;
    this.nuevoDetalle.saldo = 0;
    this.nuevoDetalle.saldofinal = 0;


    const id_gasto = this.rutaActiva.snapshot.params['id_gasto'];
    this.nuevoDetalle.id_gasto_id = id_gasto;
    this.gastoService.getGastosUno(id_gasto).subscribe(gasto => {
      if (gasto) {
        this.nuevoDetalle.num_prev = gasto.num_prev;
        this.nuevoDetalle.num_dev = gasto.num_dev;
        this.nuevoDetalle.num_pag = gasto.num_pag;
        this.nuevoDetalle.num_sec = gasto.num_sec;

      } else {
        this.nuevoDetalle.num_prev = '';
        this.nuevoDetalle.num_dev = '';
        this.nuevoDetalle.num_pag = '';
        this.nuevoDetalle.num_sec = '';

      }
    });


  }
  setSelectedItem(item: any) {
    this.selectedItem = item;

  }
  setModalCertificaciones() {

    this.selectedItem = 1;
  }

// BuscarCertificaciones() {
//   this.loading = true;
//   this.gastoService.getCertificacionUno(this.nuevoDetalle.numeroCertificacion)
//     .subscribe({
//       next: (response: any) => {
//         console.log(response);
//         if (response) {
//           this.det = Array.isArray(response) ? response : [response];
//           const cert = Array.isArray(response) ? response[0] : response;
//           this.nuevoDetalle.id_certificado_id = cert.id_certificacion;
//           this.nuevoDetalle.nota_solicitud = cert.nota_solicitud;
//           this.nuevoDetalle.area_organizacional = cert.area_organizacional;
//           this.nuevoDetalle.descripcionEspecificaRequerimientos = cert.descripcionEspecificaRequerimientos;
//           this.nuevoDetalle.operaciones = cert.operaciones;
//           this.nuevoDetalle.catProg = cert.catePorgr;
//           this.nuevoDetalle.partida = cert.partida_id;
//           this.nuevoDetalle.tareas = cert.tareas;
//           this.nuevoDetalle.costoTotal = cert.costoTotal;
//           this.nuevoDetalle.ejecutado = cert.ejecutado;
//           this.nuevoDetalle.saldo = cert.saldo;
//           this.calculateCostoTotal();
//           this.isAlert = true;

//           // Automatically load detalles related to this certification
//           this.cargarDetalles();  // <-- call cargarDetalles() here to load details immediately
//         } else {
//           this.det = [];
//           Swal.fire({
//             icon: 'warning',
//             title: 'No encontrado',
//             text: 'La certificación no existe o no se encontró ningún dato.',
//           });
//         }
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error(error);
//         this.loading = false;
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'Ocurrió un error al buscar la certificación.',
//         });
//       }
//     });
// }
BuscarCertificaciones() {
  this.loading = true;
  const numeroCertificacion = this.nuevoDetalle.numeroCertificacion;
  const currentDetalleId = this.nuevoDetalle.id_gasto_det; // assuming this property exists to identify the current detail

  // Check if the certification is already loaded in det for the same numeroCertificacion and different id_detalle
  const exists = this.det.some(d => 
    d.numeroCertificacion === numeroCertificacion && 
    d.id_detalle === currentDetalleId
  );
  if (exists) {
    this.loading = false;
    Swal.fire({
      icon: 'info',
      title: 'Certificación ya Registrada',
      text: 'Esta certificación ya fue seleccionada anteriormente para este detalle presupuestario.',
    });
    return;
  }

  this.gastoService.getCertificacionUno(numeroCertificacion)
    .subscribe({
      next: (response: any) => {
        if (response) {
          const newCerts = Array.isArray(response) ? response : [response];
          // Append new certificates to det, avoiding duplicates by numeroCertificacion and id_detalle
          newCerts.forEach(cert => {
            const duplicate = this.det.some(d => 
              d.numeroCertificacion === cert.numeroCertificacion && 
              d.id_detalle === currentDetalleId
            );
            if (!duplicate) {
              this.det.push(cert);
            }
          });

          // Set nuevoDetalle to the first new certificate
          const cert = newCerts[0];
          this.nuevoDetalle.id_certificado_id = cert.id_certificacion;
          this.nuevoDetalle.nota_solicitud = cert.nota_solicitud;
          this.nuevoDetalle.area_organizacional = cert.area_organizacional;
          this.nuevoDetalle.descripcionEspecificaRequerimientos = cert.descripcionEspecificaRequerimientos;
          this.nuevoDetalle.operaciones = cert.operaciones;
          this.nuevoDetalle.catProg = cert.catePorgr;
          this.nuevoDetalle.partida = cert.partida_id;
          this.nuevoDetalle.tareas = cert.tareas;
          this.nuevoDetalle.costoTotal = cert.costoTotal;
          this.nuevoDetalle.ejecutado = cert.ejecutado;
          this.nuevoDetalle.saldo = cert.saldo;
          this.calculateCostoTotal();
          this.isAlert = true;

          this.cargarDetalles();
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'No encontrado',
            text: 'La certificación no existe o no se encuentra Aprobado.',
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al buscar la certificación.',
        });
      }
    });
}
  receiveMessageCertificaciones($event: any) {
    if ($event) {
      const yaRegistrada = this.det.some(d => d.id_certificado_id === $event.id_certificacion);
      if (yaRegistrada) {
        Swal.fire('Advertencia', 'Esta certificación ya fue registrada en el detalle y no puede volver a seleccionarse.', 'warning');
        return;
      }
      this.nuevoDetalle.id_certificado_id = $event.id_certificacion
      this.nuevoDetalle.numeroCertificacion = $event.numeroCertificacion;
      this.nuevoDetalle.nota_solicitud = $event.nota_solicitud;
      this.nuevoDetalle.area_organizacional = $event.area_organizacional;
      this.nuevoDetalle.descripcionEspecificaRequerimientos = $event.descripcionEspecificaRequerimientos;
      this.nuevoDetalle.operaciones = $event.operaciones;
      this.nuevoDetalle.tareas = $event.tareas;
      this.nuevoDetalle.descripcion = $event.descripcion;
      this.nuevoDetalle.costoTotal = $event.costoTotal;
      this.nuevoDetalle.ejecutado = $event.ejecutado;
      this.nuevoDetalle.saldo = $event.saldo;
      this.nuevoDetalle.catProg = $event.catePorgr;
      this.nuevoDetalle.partida = $event.partida_id;
      this.calculateCostoTotal();
      this.isAlert = true;
    }

  }

  constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private rutaActiva: ActivatedRoute,
    private detalleService: DetalleGastoService,
    private gastoService: GastosService,
    private _location: Location) { }

  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      order: [[0, 'desc']],
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
      id_gasto_id: ['', Validators.required],
      id_certificado_id: ['', Validators.required],
      numeroCertificacion: ['', Validators.required],
      area_organizacional: ['', Validators.required],
      descripcionEspecificaRequerimientos: ['', Validators.required],
      operaciones: ['', Validators.required],
      tareas: ['', Validators.required],
      catProg: ['', Validators.required],
      partida: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: ['', Validators.required],
      precioUnitario: ['', Validators.required],
      costoTotal: ['', Validators.required],
      ejecutado: ['', Validators.required],
      saldo: ['', Validators.required],
      num_prev: ['', Validators.required],
      num_dev: ['', Validators.required],
      num_pag: ['', Validators.required],
      num_sec: ['', Validators.required],
    })

    this.cargarDetalles();
  }

  goBack() {
    this._location.back();
  }
  addDet() {
    this.VisibleAdd = false
    this.isLoading = false
    this.initDetalle();
    this.titleCard = 'REGISTRO DETALLE PRESUPUESTARIO';
    this.saveUpdate = true;
    this.isAlert = false;

  }
  cancelAddDet() {
    this.VisibleAdd = true
    this.cargarDetalles();
  }
  updateDet(nuevoDetalle: GastoDetalle) {
    this.VisibleAdd = false
    this.isLoading = false
    this.submitted = true;
    this.nuevoDetalle = nuevoDetalle
    this.titleCard = 'MODIFICACION DE REGISTRO'
    this.saveUpdate = false
    this.isAlert = false;

  }
  calculateCostoTotal(): void {
    const ejecutado = Number(this.nuevoDetalle.ejecutado) || 0;
    const saldo = Number(this.nuevoDetalle.saldo) || 0;
    this.nuevoDetalle.saldofinal = parseFloat((saldo - ejecutado).toFixed(2));
  }

  public cargarDetalles() {
    this.loading = true;
    this.total.registros = 0;
    this.det = [];
    const id_gasto = Number(this.rutaActiva.snapshot.params['id_gasto']);

    this.detalleService.getDetGasto().subscribe(gast => {
      console.log('DETALLES:', gast);
      this.det = gast.filter((nuevoDetalle: any) => nuevoDetalle.id_gasto_id === id_gasto);
      this.total.registros = this.det.length
      this.total.importe = this.det.reduce((total, detalle) => total + detalle.saldo, 0);
      this.rutaActiva.snapshot.params['id_gasto_det'];
      this.loading = false;
    });

  }

  guardarRegistro() {


    console.log(this.nuevoDetalle);
    this.isLoading = true;
    this.button = 'Procesando..';
   this.detalleService.postDetGasto(this.nuevoDetalle)
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

    const id_gasto_det = this.nuevoDetalle.id_gasto_det;
    if (!id_gasto_det) {
      this.isLoadingUpdate = false;
      this.button = 'Actualizar';
      Swal.fire('Error', 'ID de detalle no encontrado. No se puede actualizar.', 'error');
      return;
    }

    this.detalleService.updateDetGasto(this.nuevoDetalle, id_gasto_det.toString())
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

  eliminarDetalle(id_gasto_det: number | number): void {

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
        this.detalleService.deleteDetGasto(id_gasto_det).subscribe({
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
  keyCantidad() {

    if (this.nuevoDetalle.ejecutado > this.nuevoDetalle.saldo) {
      Swal.fire('Mensaje Informativo', 'La ejecutado no puede ser mayor al SALDO <br> SALDO: ' + this.nuevoDetalle.saldo + '<br> EJECUTADO: ' + this.nuevoDetalle.ejecutado, 'info');
      this.nuevoDetalle.ejecutado = this.nuevoDetalle.saldo
    }
  }
}




