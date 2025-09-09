import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gastos } from '../../../../models/gastos';
import { GastosService } from '../../../../service/gastos.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Unidad } from '../../../../models/unidad';
import { ClasificadorGastoService } from '../../../../service/clasificador-gasto.service';
import { Clasificador } from '../../../../models/clasificador';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  public loading: boolean = false;
  gastosFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  nuevoGasto = new Gastos();
  unidad: Unidad[] = [];
  clasificador: Clasificador[] = [];
 


  constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private gastoService: GastosService,
    private unidadService: GastosService,
    private clasificadorService: ClasificadorGastoService,
    private _location: Location,
  ) { }

  ngOnInit(): void {
      if (!this.nuevoGasto.fechaElab) {
      this.nuevoGasto.fechaElab = new Date();
    }

    this.gastosFormGroup = this._formBuilder.group({
      num_prev: ['', Validators.required],
      num_comp: ['', Validators.required],
      num_dev: ['', Validators.required],
      num_pag: ['', Validators.required],
      num_sec: ['', Validators.required],
      num_doc: ['', Validators.required],
      entidad: ['', Validators.required],
      fechaRec: ['', Validators.required],
      moneda:['',Validators.required],
      compromiso: ['', Validators.required],
      tipo_doc: ['', Validators.required],
      tipo_ejec: ['', Validators.required],
      regularizacion: ['', Validators.required],
      fechaElab: ['', Validators.required],
      estado: ['', Validators.required],
      glosa: ['', Validators.required],
      preventivo: ['', Validators.required],
      devengado: ['', Validators.required],
      unidad: ['', Validators.required],
      pagado: ['', Validators.required],
      tipo_impu: ['', Validators.required],
      id_clasif_partida: ['', Validators.required],
      des_clasif: ['', Validators.required],
    });

    //this.getUnidad();
    this.iniGasto();
    this.getClasificador();

  }
  iniGasto(){
    this.nuevoGasto.entidad='Caja Bancaria Estatal de Salud';
    this.nuevoGasto.unidad='DIRECCION ADMINISTRATIVA FINANCIERA';
    this.nuevoGasto.moneda='BOLIVIANOS'
    this.nuevoGasto.num_comp='0';
    this.nuevoGasto.num_dev='0';
    this.nuevoGasto.num_pag='0';
    this.nuevoGasto.num_sec='0';  
    this.nuevoGasto.estado='ELABORADO';
    this.nuevoGasto.id_num_clasif_id='';
  }
  

  goBack() {
    this._location.back();
  }

onTipoChange() {
  if (this.nuevoGasto.tipo_impu=== false) {
    // Reset preventivo and compromiso when SIN IMPUTACION is selected
    this.nuevoGasto.preventivo = false
    this.nuevoGasto.compromiso = false
  }
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
      this.nuevoGasto.id_num_clasif_id = tipos.id_num_clasif;
      this.nuevoGasto.des_clasif = tipos.des_clasif;
    } else {
      this.nuevoGasto.id_num_clasif_id= '';
      this.nuevoGasto.des_clasif = '';
    }

  }


  guardarRegistro() {
    this.submitted = true;

    const camposObligatorios = [ 
       this.nuevoGasto.num_prev,
       this.nuevoGasto.num_comp,
       this.nuevoGasto.num_dev ,
       this.nuevoGasto.num_pag ,
       this.nuevoGasto.num_sec ,
       this.nuevoGasto.num_doc ,
       this.nuevoGasto.entidad,
       this.nuevoGasto.fechaRec ,
       this.nuevoGasto. moneda,
       this.nuevoGasto.tipo_doc,
       this.nuevoGasto.tipo_ejec,
       this.nuevoGasto.regularizacion,
       this.nuevoGasto. unidad,
       this.nuevoGasto.tipo_impu

    ];

    if (camposObligatorios.some(campo => !campo)) {

      Swal.fire('Campos obligatorios', 'Por favor, complete todos los campos requeridos.', 'warning');
      return;
    }

    

    this.isLoading = true;
    this.button = 'Procesando..';
    this.gastoService.postGastos(this.nuevoGasto)
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
      console.log('guarda',this.nuevoGasto);
  }
}
