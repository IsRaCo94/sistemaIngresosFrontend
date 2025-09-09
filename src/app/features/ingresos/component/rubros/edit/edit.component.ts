import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Rubros } from '../../../../models/rubros';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RubrosService } from '../../../../service/rubros.service';
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
actualizarRubro = new Rubros()
  submitted = false;
  personaFormGroup!: FormGroup;
  isLoading = false;
  button = 'Actulizar';
  constructor(
    private changeDetector: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private rubrosService: RubrosService,
    private rutaActiva: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.personaFormGroup = this._formBuilder.group({
      num_rubro: ['', Validators.required],
      nombre: ['', Validators.required],
      entidad_otorgante: ['', Validators.required],
  


    });
    this.cargarRegistros()
  }
  cargarRegistros() {
    this.rubrosService.getRubrosUno(this.rutaActiva.snapshot.params['id_tipo_rubro'])
      .subscribe((rubros: any) => {
        this.actualizarRubro = rubros;
        this.personaFormGroup.patchValue({
          num_rubro: rubros.num_rubro,
          nombre: rubros.nombre,
          entidad_otorgante: rubros.entidad_otorgante,
        });


      });
  }
  goBack() {
    this._location.back();
  }

  actualizarRegistro() {
    this.submitted = true;

    const camposObligatorios = [
      this.actualizarRubro.num_rubro,
      this.actualizarRubro.nombre,
      this.actualizarRubro.entidad_otorgante,

    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
      return;
    }
    this.isLoading = true;
    this.button = 'Procesando..';
    this.rubrosService.updateRubros(this.actualizarRubro, this.rutaActiva.snapshot.params['id_tipo_rubro'])
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
