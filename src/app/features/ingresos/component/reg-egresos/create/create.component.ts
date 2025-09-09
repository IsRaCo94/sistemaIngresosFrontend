import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { egresos } from '../../../../models/egresos';
import { empresa } from '../../../../models/empresa';
import { EgresosService } from '../../../../service/egresos.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
    public loading: boolean = false;
    ingresoFormGroup!: FormGroup;
    submitted = false;
    isLoading = false;
    button = 'Guardar';
    nuevoEgreso = new egresos();
    
 

  constructor(
     private _formBuilder: FormBuilder,
        private changeDetector: ChangeDetectorRef,
        private egresoService: EgresosService,
        private _location: Location,
  ) { }

  ngOnInit(): void {
    if (!this.nuevoEgreso.fecha) {
  this.nuevoEgreso.fecha = new Date();
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
    this.iniEgreso()
  }
    iniEgreso() {

    this.nuevoEgreso.lugar = 'LA PAZ'
    this.nuevoEgreso.estado = 'PENDIENTE'
  }
  goBack() {
    this._location.back();
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

    this.nuevoEgreso.proveedor = $event.nombre
    this.nuevoEgreso.id_empresa_id = $event.id_empresa
    this.nuevoEgreso.cod_prove = $event.codigo

  }

    guardarRegistro() {
      this.submitted = true;
  
      const camposObligatorios = [
        this.nuevoEgreso.num_cheque,
        this.nuevoEgreso.lugar,
        this.nuevoEgreso.fecha,
        this.nuevoEgreso.fecha_cobro,
        this.nuevoEgreso.monto,
        this.nuevoEgreso.cod_prove,
        this.nuevoEgreso.proveedor,
        this.nuevoEgreso.observacion,
        this.nuevoEgreso.estado,
        this.nuevoEgreso.cerrado,
        this.nuevoEgreso.cobrado,
        this.nuevoEgreso.id_empresa_id
      ];
  
      if (camposObligatorios.some(campo => !campo)) {
        Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
        return;
      }
  
      this.isLoading = true;
      this.button = 'Procesando..';
      this.egresoService.postEgresos(this.nuevoEgreso)
     .subscribe({ 
        next: (res: any) => {
          this.isLoading = false;
          this.button = 'Guardar';
          Swal.fire('Registro Exitoso', res.message || 'El egreso se registró correctamente.', 'success');
          this.goBack(); 
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


}
