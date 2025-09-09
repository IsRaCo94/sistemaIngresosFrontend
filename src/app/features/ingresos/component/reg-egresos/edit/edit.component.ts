import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EgresosService } from '../../../../service/egresos.service';
import { egresos } from '../../../../models/egresos';
import { empresa } from '../../../../models/empresa';

@Component({
  selector: 'app-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  public loading: boolean = false;
  ingresoFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Actualizar';
  actualizarEgreso = new egresos();




  constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private egresoService: EgresosService,
    private _location: Location,
    private rutaActiva: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (!this.actualizarEgreso.fecha) {
      this.actualizarEgreso.fecha = new Date();
    }
    this.ingresoFormGroup = this._formBuilder.group({
      num_cheque: ['', Validators.required],
      lugar: ['', Validators.required],
      fecha: ['', Validators.required],
      monto: ['', Validators.required],
      cod_prove: ['', Validators.required],
      estado: ['', Validators.required],
      cobrado: ['', Validators.required],
      proveedor: ['', Validators.required],
      cerrado: ['', Validators.required],
      observacion: ['', Validators.required],
      fecha_cobro: ['', Validators.required],
      id_empresa_id: ['', Validators.required],
    });
    this.cargarRegistros()
  }
  iniEgreso() {

    this.actualizarEgreso.lugar = 'LA PAZ'
    this.actualizarEgreso.estado = 'PENDIENTE'
  }
  goBack() {
    this._location.back();
  }
  cargarRegistros() {
    this.egresoService.getEgresosUno(this.rutaActiva.snapshot.params['id_egresos'])
      .subscribe((egresos: any) => {
        if (egresos.fecha_cobro) {
          egresos.fecha_cobro = new Date(egresos.fecha_cobro.split('T')[0]);
        }
        if (egresos.fecha) {
          egresos.fecha = new Date(egresos.fecha.split('T')[0]);
        }
        this.actualizarEgreso = egresos;
      });
  }

  proveedor = new empresa;
  proveedores: empresa[] = [];
  selectedItem: any;

  titleCard = '';

  setSelectedItem(item: any) {
    this.selectedItem = item;
  }
  setModalProveedor() {
    this.selectedItem = 1;
  }

  receiveMessageProveedor($event: any) {

    this.actualizarEgreso.proveedor = $event.nombre
    this.actualizarEgreso.id_empresa_id = $event.id_empresa
    this.actualizarEgreso.cod_prove = $event.codigo

  }
  actualizarRegistro() {
    this.submitted = true;

    const camposObligatorios = [
      this.actualizarEgreso.num_cheque,
      this.actualizarEgreso.lugar,
      this.actualizarEgreso.fecha,
      this.actualizarEgreso.fecha_cobro,
      this.actualizarEgreso.monto,
      this.actualizarEgreso.cod_prove,
      this.actualizarEgreso.proveedor,
      this.actualizarEgreso.observacion,
      this.actualizarEgreso.estado,
      this.actualizarEgreso.cerrado,
      this.actualizarEgreso.cobrado,
      this.actualizarEgreso.id_empresa_id
    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
      return;
    }
    this.isLoading = true;
    this.button = 'Procesando..';
    this.egresoService.updateEgresos(this.actualizarEgreso, this.rutaActiva.snapshot.params['id_egresos'])
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.button = 'Guardar';
          Swal.fire('Registro Exitoso', res.message || 'El ingreso se actualizó correctamente.', 'success');
          this.goBack();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.button = 'Guardar';
          console.error('Error al guardar registro:', error);
          if (error.status === 409) {
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
}
