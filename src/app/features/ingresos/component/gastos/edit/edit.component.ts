import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gastos } from '../../../../models/gastos';
import { GastosService } from '../../../../service/gastos.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Clasificador } from '../../../../models/clasificador';
import { ClasificadorGastoService } from '../../../../service/clasificador-gasto.service';

@Component({
  selector: 'app-edit',
  standalone: false,
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit{
  public loading: boolean = false;
  gastosFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Actualizar';
  actualizarGastos = new Gastos();
    clasificador: Clasificador[] = [];
    constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private gastoService: GastosService,
    private unidadService: GastosService,
     private rutaActiva: ActivatedRoute,
    private _location: Location,
    private clasificadorService: ClasificadorGastoService,
  ) { }
 
  ngOnInit(): void {

     this.gastosFormGroup = this._formBuilder.group({
      num_prev: ['', Validators.required],
      num_comp: ['', Validators.required],
      num_dev: ['', Validators.required],
      num_pag: ['', Validators.required],
      num_sec: ['', Validators.required],
      entidad: ['', Validators.required],
      tipo_impu: ['', Validators.required],
      tipo_doc: ['', Validators.required],
      tipo_ejec: ['', Validators.required],
      regularizacion: ['', Validators.required],
      fechaElab: ['', Validators.required],
      estado: ['', Validators.required],
      glosa: ['', Validators.required],
      id_persona_id: ['', Validators.required],
      id_certificacion_id: ['', Validators.required],
      id_partida_id: ['', Validators.required],
      id_entidad_id: ['', Validators.required],
      id_cuenta_id: ['', Validators.required],
      id_insumo_id: ['', Validators.required],
      id_tipo_doc: ['', Validators.required],
      id_unidad_id: ['', Validators.required],
    });

    this.getClasificador();
    this.cargarRegistros();

  }
    getClasificador() {
    this.clasificadorService.getclasificacionGastos()
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            this.clasificador = response;
          }
        },
        error => console.log(<any>error));
       
        
  }
  getClasificadorGastoChance(id_num_clasif: any) {
    const tipos = this.clasificador.find(x => x.id_num_clasif == id_num_clasif);
    if (tipos && tipos.des_clasif && tipos.des_clasif.length > 0) {
      this.actualizarGastos.id_num_clasif_id = tipos.id_num_clasif;
      this.actualizarGastos.des_clasif = tipos.des_clasif;
    } else {
      this.actualizarGastos.id_num_clasif_id= '';
      this.actualizarGastos.des_clasif = '';
    }

  }
  get f() { return this.gastosFormGroup.controls; }

  goBack() {
    this._location.back();
  }
    cargarRegistros() {
    this.gastoService.getGastosUno(this.rutaActiva.snapshot.params['id_gasto'])
      .subscribe((gastos: any) => {
        if (gastos.fechaElab) {
         const fechaRegDate = new Date(gastos.fechaElab);
        gastos.fechaElab = new Date(fechaRegDate.getFullYear(), fechaRegDate.getMonth(), fechaRegDate.getDate(),fechaRegDate.getHours());
        }
          if (gastos.fechaRec) {
         const fechaRegDate = new Date(gastos.fechaRec);
        gastos.fechaRec = new Date(fechaRegDate.getFullYear(), fechaRegDate.getMonth(), fechaRegDate.getDate(),fechaRegDate.getHours());
        }
        this.actualizarGastos = gastos;
      });
  }
  onTipoChange() {
  if (this.actualizarGastos.tipo_impu=== false) {
    // Reset preventivo and compromiso when SIN IMPUTACION is selected
    this.actualizarGastos.preventivo = false
    this.actualizarGastos.compromiso = false
  }
}
   actualizarRegistro() {
      // this.submitted = true;
  
      // const camposObligatorios = [
      //   this.actualizarIngreso.num_depo,
      //   this.actualizarIngreso.lugar,
      //   this.actualizarIngreso.fecha,
      //   this.actualizarIngreso.monto,
      //   this.actualizarIngreso.cod_prove,
      //   this.actualizarIngreso.proveedor,
      //   this.actualizarIngreso.detalle,
      //   this.actualizarIngreso.estado,
      //   this.actualizarIngreso.tipo_ingres,
      //   this.actualizarIngreso.cerrado,
      //   this.actualizarIngreso.id_empresa_id,
      //   this.actualizarIngreso.id_tipo_ingr_id
      // ];
  
      // if (camposObligatorios.some(campo => !campo)) {
      //   Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
      //   return;
      // }
  
      this.isLoading = true;
      this.button = 'Procesando..';
      this.gastoService.updateGatos(this.actualizarGastos, this.rutaActiva.snapshot.params['id_gasto'])
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


