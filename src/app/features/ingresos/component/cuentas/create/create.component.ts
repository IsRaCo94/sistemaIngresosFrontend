import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Cuenta } from '../../../../models/cuenta';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaService } from '../../../../service/cuenta.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  nuevaCuenta = new Cuenta()
  submitted = false;
  cuentaFormGroup!: FormGroup;
  isLoading = false;
  button = 'Guardar';
  libretaFormGroup: any;
   constructor(
    private changeDetector: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private cuentaService: CuentaService
  ){}
 
 
  ngOnInit(): void {
     this.libretaFormGroup = this._formBuilder.group({
      libreta: ['', Validators.required],
      des_libreta: ['', Validators.required],
      des_corta_libreta: ['', Validators.required],
    
  
    });

  }
    goBack() {
    this._location.back();
  }

  guardarRegistro() {
   this.submitted = true;

    const camposObligatorios = [
    this.nuevaCuenta.banco,
    this.nuevaCuenta.cuenta,
    this.nuevaCuenta.des_cuenta
    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
      return;
    }
  this.submitted = true;
  this.isLoading = true;
  this.button = 'Procesando..';

  this.cuentaService.postCuenta(this.nuevaCuenta)
    .subscribe({ 
      next: (res: any) => {
        this.isLoading = false;
        this.button = 'Guardar';
        Swal.fire('Registro Exitoso', res.message || 'Se registró correctamente.', 'success');
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
