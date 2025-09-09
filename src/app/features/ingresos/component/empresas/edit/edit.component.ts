import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { empresa } from '../../../../models/empresa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { EmpresaService } from '../../../../service/empresa.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit{
   newEmpresa= new empresa
    submitted = false;
    poaFormGroup!: FormGroup;
    isLoading = false;
    button = 'Actualizar';
    actualizaEmpresa= new empresa()
    
    constructor(
      private changeDetector: ChangeDetectorRef,
      private _formBuilder: FormBuilder,
      private _location: Location,
      private empresaService: EmpresaService,
      private rutaActiva: ActivatedRoute
    ){}
    
    
    ngOnInit(): void {
       this.poaFormGroup = this._formBuilder.group({
        codigo: ['', Validators.required],
        nombre: ['', Validators.required],
        tipo: ['', Validators.required],
        direccion: ['', Validators.required],
        telefono: ['', Validators.required],
       
      });
        this.cargarRegistros();
    }
      get f() { return this.poaFormGroup.controls; }
  
    goBack() {
      this._location.back();
    }
cargarRegistros() {
  
  this.empresaService.getEmpresaUno(this.rutaActiva.snapshot.params['id_empresa'])
    .subscribe((empresa: any) => {
      this.actualizaEmpresa = empresa;
      // Llenar el formulario con los datos recibidos
      this.poaFormGroup.patchValue({
        codigo: empresa.codigo,
        nombre: empresa.nombre,
        tipo: empresa.tipo,
        direccion: empresa.direccion,
        telefono: empresa.telefono
        
      });
    });
}
  
    actualizarRegistro(){
    this.submitted = true;

      this.isLoading = true;
      this.button = 'Procesando..';
      this.empresaService.updateEmpresa(this.actualizaEmpresa,this.rutaActiva.snapshot.params['id_empresa'])
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
