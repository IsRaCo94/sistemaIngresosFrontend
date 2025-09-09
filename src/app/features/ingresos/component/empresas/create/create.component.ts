import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { empresa } from '../../../../models/empresa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { EmpresaService } from '../../../../service/empresa.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  newEmpresa= new empresa()
  submitted = false;
  poaFormGroup!: FormGroup;
  isLoading = false;
  button = 'Guardar';

  
  constructor(
    private changeDetector: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _location: Location,
    private empresaCreateService: EmpresaService,
  
  ){}
  
  
  ngOnInit(): void {
     this.poaFormGroup = this._formBuilder.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      id_empresa: ['', Validators.required],
    });
   
    this.iniEmpresas();
  }
  
  iniEmpresas(){
    this.newEmpresa.nombre,
    this.newEmpresa.nit
   
   

  }

    get f() { return this.poaFormGroup.controls; }

  goBack() {
    this._location.back();
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

guardarRegistro() {

 
  this.newEmpresa.codigo 
   this.submitted = true;

    const camposObligatorios = [
    //this.newEmpresa.codigo,
    this.newEmpresa.nombre,
    this.newEmpresa.nit,
 

    ];

    if (camposObligatorios.some(campo => !campo)) {
      Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
      return;
    }
  this.submitted = true;
  this.isLoading = true;
  this.button = 'Procesando..';

  this.empresaCreateService.postEmpresa(this.newEmpresa)
    .subscribe({ 
      next: (res: any) => {
        this.isLoading = false;
        this.button = 'Guardar';
        Swal.fire('Registro Exitoso', res.message || 'La empresa se registró correctamente.', 'success');
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
