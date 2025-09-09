import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibretaService } from '../../../../service/libreta.service';
import { Location } from '@angular/common';
import { Libreta } from '../../../../models/libreta';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  actualizarLibreta = new Libreta()
  submitted = false;
  libretaFormGroup!: FormGroup;
  isLoading = false;
  button = 'Actulizar';
  constructor(
    private changeDetector: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private libretaService: LibretaService,
    private rutaActiva: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.libretaFormGroup = this._formBuilder.group({
      libreta: ['', Validators.required],
      des_libreta: ['', Validators.required],
      des_corta_libreta: ['', Validators.required],


    });
    this.cargarRegistros()
  }
  cargarRegistros() {
    this.libretaService.getLibretaUno(this.rutaActiva.snapshot.params['id_libreta'])
      .subscribe((libretas: any) => {
        this.actualizarLibreta = libretas;
        this.libretaFormGroup.patchValue({
          libreta: libretas.codigo,
          des_libreta: libretas.nombre,
          des_corta_libreta: libretas.tipo,


        });


      });
  }
  goBack() {
    this._location.back();
  }

  actualizarRegistro() {
    this.submitted = true;

    const camposObligatorios = [
      this.actualizarLibreta.libreta,
      this.actualizarLibreta.des_libreta,
      this.actualizarLibreta.des_corta_libreta,

    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
      return;
    }
    this.isLoading = true;
    this.button = 'Procesando..';
    this.libretaService.updateLibreta(this.actualizarLibreta, this.rutaActiva.snapshot.params['id_libreta'])
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
