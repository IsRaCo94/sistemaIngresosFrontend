import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Cuenta } from '../../../../models/cuenta';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaService } from '../../../../service/cuenta.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
actualizarCuenta = new Cuenta()
  submitted = false;
  cuentaFormGroup!: FormGroup;
  isLoading = false;
  button = 'Actulizar';
  constructor(
    private changeDetector: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private cuentaService: CuentaService,
    private rutaActiva: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.cuentaFormGroup = this._formBuilder.group({
      nombre: ['', Validators.required],
      carnet: ['', Validators.required],
      exp: ['', Validators.required],


    });
    this.cargarRegistros()
  }
  cargarRegistros() {
    this.cuentaService.getCuentaUno(this.rutaActiva.snapshot.params['id_cuenta'])
      .subscribe((cuentas: any) => {
        this.actualizarCuenta = cuentas;
        this.cuentaFormGroup.patchValue({
          banco: cuentas.banco,
          cuenta: cuentas.cuenta,
          des_cuenta: cuentas.des_cuenta,
        });


      });
  }
  goBack() {
    this._location.back();
  }

  actualizarRegistro() {
    this.submitted = true;

    const camposObligatorios = [
      this.actualizarCuenta.banco,
      this.actualizarCuenta.cuenta,
      this.actualizarCuenta.des_cuenta,

    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
      return;
    }
    this.isLoading = true;
    this.button = 'Procesando..';
    this.cuentaService.updateCuenta(this.actualizarCuenta, this.rutaActiva.snapshot.params['id_cuenta'])
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
