import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ingresos } from '../../../../models/ingresos';
import { IngresosService } from '../../../../service/ingresos.service';
import { empresa } from '../../../../models/empresa';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoIngreso } from '../../../../models/TipoIngreso';
import { RubrosDetalle } from '../../../../models/rubrosDetalle';
import { DetalleRubrosService } from '../../../../service/detalle-rubros.service';

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
  actualizarIngreso = new ingresos();
  tipoIngresos: TipoIngreso[] = [];
  tipoRubros: RubrosDetalle[] = [];
showAmortizacion: boolean = false;
  showDemasia: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private ingresoService: IngresosService,
    private _location: Location,
    private rutaActiva: ActivatedRoute,
    private tipoingresoService: IngresosService,
    private rubrosService: DetalleRubrosService,
  ) { }


  ngOnInit(): void {
    if (!this.actualizarIngreso.fecha_reg) {
      this.actualizarIngreso.fecha_reg = new Date();
    }
    this.ingresoFormGroup = this._formBuilder.group({
      num_recibo: ['', Validators.required],
      lugar: ['', Validators.required],
      fecha: ['', Validators.required],
      monto: ['', Validators.required],
      cod_prove: ['', Validators.required],
      proveedor: ['', Validators.required],
      detalle: ['', Validators.required],
      estado: ['', Validators.required],
      tipo_ingres: ['', Validators.required],
      cerrado: ['', Validators.required],
      id_empresa_id: ['', Validators.required],
      id_tipo_ingr_id: ['', Validators.required],
      multas: ['', Validators.required],
      intereses: ['', Validators.required],
      aportes_patro: ['', Validators.required],
      deposito_dema: ['', Validators.required],
      amortizacion_pagos: ['', Validators.required],
      cuenta: ['', Validators.required],
      num_form: ['', Validators.required],
      op_multas: ['', Validators.required],
      op_intereses: ['', Validators.required],
      op_aportes_patro: ['', Validators.required],
      op_deposito_dema: ['', Validators.required],
      op_amortizacion_pagos: ['', Validators.required],
      num_factura: ['', Validators.required],
      importe_total: ['', Validators.required],

    });
    this.cargarRegistros();
    this.getTipoIngreso()
    this.iniIngreso()
    this.getTipoRubro()
    this.calculateCostoTotal();
    this.calculateCostoTotal2();

    // No llamar aquí: resetea campos ya cargados al editar
  }

  iniIngreso() {
    this.actualizarIngreso.cerrado = 'SI';
    this.actualizarIngreso.estado = 'CONSOLIDADO';

  }

  get f() { return this.ingresoFormGroup.controls; }

  goBack() {
    this._location.back();
  }
  // cargarRegistros() {
  //   this.ingresoService.getIngresosUno(this.rutaActiva.snapshot.params['id_ingresos'])
  //     .subscribe((ingresos: any) => {
  //       if (ingresos.fecha_reg) {
  //         const fechaRegDate = new Date(ingresos.fecha_reg);
  //         ingresos.fecha_reg = new Date(fechaRegDate.getFullYear(), fechaRegDate.getMonth(), fechaRegDate.getDate(), fechaRegDate.getHours());
  //       }
  //       if (ingresos.fecha) {
  //         const fechaDate = new Date(ingresos.fecha);
  //         ingresos.fecha = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate());
  //       }
  //       if (ingresos.tipo_emision) {
  //         ingresos.op_tipoemision = ingresos.tipo_emision.toLowerCase();
  //       } else {
  //         ingresos.op_tipoemision = typeof ingresos.op_tipoemision === 'string'
  //           ? ingresos.op_tipoemision
  //           : 'recibo';
  //       }

  //       this.actualizarIngreso = ingresos;
  //       console.log('Tipo de emisión:', {
  //         original: ingresos.tipo_emision,
  //         asignado: this.actualizarIngreso.op_tipoemision
  //       });
  //     });
  // }
  cargarRegistros() {
    this.ingresoService.getIngresosUno(this.rutaActiva.snapshot.params['id_ingresos'])
      .subscribe((ingresos: any) => {
        if (ingresos.fecha_reg) {
          const fechaRegDate = new Date(ingresos.fecha_reg);
          ingresos.fecha_reg = new Date(fechaRegDate.getFullYear(), fechaRegDate.getMonth(), fechaRegDate.getDate(), fechaRegDate.getHours());
        }
        if (ingresos.fecha) {
          const fechaDate = new Date(ingresos.fecha);
          ingresos.fecha = new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate());
        }
        
        // Set checkboxes based on actual record values
        this.showAmortizacion = ingresos.amortizacion_pagos > 0;
        this.showDemasia = ingresos.deposito_dema > 0;
    
        switch (ingresos.tipo_emision) {
          case 'FACTURA':
            ingresos.op_tipoemision = 'factura';
            break;
          case 'RECIBO':
            ingresos.op_tipoemision = 'recibo';
            break;
          case 'DOCUMENTO':
            ingresos.op_tipoemision = 'documento';
            break;
        }

  
        this.actualizarIngreso = ingresos;
        console.log('Ingreso:', this.actualizarIngreso);
        
      });
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
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

    this.actualizarIngreso.proveedor = $event.EMP_NOM
    //this.actualizarIngreso.id_empresa_id = $event.id_empresa
    this.actualizarIngreso.cod_prove = $event.EMP_COD
    this.actualizarIngreso.nit = $event.EMP_NIT;
    if (this.actualizarIngreso.op_tipoemision !== 'factura') {
      this.actualizarIngreso.nit = 0;
    }
    console.log('recibe:', this.actualizarIngreso.nit);

  
  }
  getTipoIngreso() {
    this.tipoingresoService.getTipoIngreso()
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            this.tipoIngresos = response;
          }
        },
        error => console.log(<any>error));
  }
  getTipoIngresoChange(id_tipo_ingr: any) {
    const tipos = this.tipoIngresos.find(x => x.id_tipo_ingr == id_tipo_ingr);
    if (tipos && tipos.tipo_ingr && tipos.tipo_ingr.length > 0) {
      this.actualizarIngreso.id_tipo_ingr_id = tipos.id_tipo_ingr;
      this.actualizarIngreso.tipo_ingres = tipos.tipo_ingr;
    } else {
      this.actualizarIngreso.id_tipo_ingr_id = '';
      this.actualizarIngreso.tipo_ingres = '';
    }
  }
  getTipoRubro() {
    this.rubrosService.getDetRubros()
      .subscribe(
        (response: any) => {
          if (response.length > 0) {
            this.tipoRubros = response;
          }
        },
        error => console.log(<any>error));
  }


  getTipoRubroChange(id_rubro: any) {
    const tipos = this.tipoRubros.find(x => x.id_detalle_rubro == id_rubro);
    if (tipos && tipos.servicio && tipos.nombre.length > 0) {
      this.actualizarIngreso.id_tipo_rubro = tipos.id_detalle_rubro;
      this.actualizarIngreso.servicio = tipos.servicio;
      this.actualizarIngreso.nombre = tipos.nombre;
      this.actualizarIngreso.servicio = tipos.servicio;
      this.actualizarIngreso.num_rubro = tipos.num_rubro;
      this.updateDetalle();
      // <-- Add this line to update detalle on rubro change
    } else {
      this.actualizarIngreso.id_tipo_rubro = '';
      this.actualizarIngreso.nombre = '';

    }
    console.log('recibo', this.actualizarIngreso.detalle);

  }
  getNextNumDeposito() {
    this.ingresoService.getLastNumDeposito().subscribe({
      next: (lastNum: number) => {
        // Start from 1000 if lastNum is less than 1000
        this.actualizarIngreso.num_recibo = lastNum >= 1000 ? lastNum++ : 1000;
      },
      error: (error) => {
        console.error('Error fetching last num_depo:', error);
        this.actualizarIngreso.num_recibo = 1000; // fallback start from 1000
      }
    });
  }
  getNextNumFactura() {

    this.ingresoService.getLastNumFactura().subscribe({
      next: (lastNum: number) => {
        // Start from 1000 if lastNum is less than 1000
        this.actualizarIngreso.num_factura = lastNum >= 100 ? lastNum++ : 100;
      },
      error: (error) => {
        console.error('Error fetching last num_factura:', error);
        this.actualizarIngreso.num_factura = 100; // fallback start from 1000
      }
    });
  }
  calculateCostoTotal(): void {
    const amortizacion_pagos = Number(this.actualizarIngreso.amortizacion_pagos) || 0;
    const deposito_dema = Number(this.actualizarIngreso.deposito_dema) || 0;
    const monto = Number(this.actualizarIngreso.monto) || 0;
    this.actualizarIngreso.importe_total = parseFloat((monto + amortizacion_pagos + deposito_dema).toFixed(2));
  }
  calculateCostoTotal2(): void {
    const monto = Number(this.actualizarIngreso.monto) || 0;
    this.actualizarIngreso.importe_total = parseFloat((monto).toFixed(2));
  }


  updateDetalle() {
    let detalleParts = [];

    if (this.actualizarIngreso.servicio === 'VENTA DE CARNETS DE ASEGURADO') {
      this.actualizarIngreso.detalle = 'VENTA DE CARNETS';
      return;
    }
    if (this.actualizarIngreso.servicio === 'VENTA DE FORMULARIOS DE APORTES') {
      this.actualizarIngreso.detalle = 'APORTE PATRONAL MES DE';
      return;
    }
    if (this.actualizarIngreso.servicio === 'FORMULARIOS DE NOVEDADES') {
      this.actualizarIngreso.detalle = 'FORMULARIOS DE NOVEDADES';
      return;
    }
    if (this.actualizarIngreso.servicio === 'VENTA DE EXAMENES POST OCUPACIONALES') {
      this.actualizarIngreso.detalle = 'VENTA DE FORMULARIOS POST OCUPACIONALES';
      return;
    }
    if (this.actualizarIngreso.servicio === 'VENTA DE EXAMENES PRE OCUPACIONALES') {
      this.actualizarIngreso.detalle = 'VENTA DE FORMULARIOS PRE OCUPACIONALES';
      return;
    }

    if (this.actualizarIngreso.servicio === 'MULTAS POR BAJA DEL ASEGURADO') {
      this.actualizarIngreso.detalle = 'MULTAS POR BAJA DEL ASEGURADO';
      return;
    }
    if (this.actualizarIngreso.servicio === 'MULTAS FISCALIZACION APORTES NO COTIZADOS') {
      this.actualizarIngreso.detalle = 'MULTAS FICALIZACION APORTES NO COTIZADOS';
      return;
    }
    if (this.actualizarIngreso.servicio === 'MULTAS POR INCUMPLIMIENTOS A CONTRATOS') {
      this.actualizarIngreso.detalle = 'MULTAS POR INCUMPLIMIENTOS A CONTRATOS';
      return;
    }
    if (this.actualizarIngreso.servicio === 'MULTAS INCUMPLIMIENTO PRESENTACION DE PLANILLAS') {
      this.actualizarIngreso.detalle = 'MULTAS INCUMPLIMIENTO PRESENTACION DE PLANILLAS';
      return;
    }
    if (this.actualizarIngreso.servicio === 'VENTA DE BIDONES') {
      this.actualizarIngreso.detalle = 'VENTA DE BIDONES';
      return;
    }
    if (this.actualizarIngreso.servicio === 'RECAUDACION POR INTERNADO ROTATORIO') {
      this.actualizarIngreso.detalle = 'RECAUDACION POR INTERNADO ROTATORIO';
      return;
    }
    if (this.actualizarIngreso.servicio === 'APORTES PATRONALES Y APORTES (PRIVADO)') {
      this.actualizarIngreso.detalle = 'APORTES PATRONALES APORTES (PRIVADO)';
      return;
    }
    if (this.actualizarIngreso.servicio === 'APORTES PATRONALES Y APORTES (PUBLICO)') {
      this.actualizarIngreso.detalle = 'APORTES PATRONALES APORTES (PUBLICO)';
      return;
    }

    if (this.actualizarIngreso.op_deposito_dema) {
      detalleParts.push('DEPOSITO EN DEMASIA');
    }
    if (this.actualizarIngreso.op_amortizacion_pagos) {
      detalleParts.push('AMORTIZACIÓN MENSUAL DE CONVENIO DE PLAN DE PAGOS:');
    }
    this.actualizarIngreso.detalle = detalleParts.join(' - ');
  }
  onOpAportesPatroChange() {
    this.updateDetalle();
  }

  onOpAmortizacionPagosChange() {
    this.updateDetalle();
  }

  onOpTipoEmisionChange($event: any) {
    // Reset fields related to proveedor and others as needed
    this.actualizarIngreso.proveedor = '';
    this.actualizarIngreso.lugar;
    this.actualizarIngreso.fecha;
    this.actualizarIngreso.tipo_ingres
    this.actualizarIngreso.estado = 'CONSOLIDADO';
    this.actualizarIngreso.id_tipo_ingr_id = '';
    this.actualizarIngreso.tipo_ingres = '';
    this.actualizarIngreso.venta_form = 0;
    this.actualizarIngreso.venta_serv = 0;
    this.actualizarIngreso.inter_rota = 0;
    this.actualizarIngreso.id_tipo_rubro = '';
    this.actualizarIngreso.detalle = '';
    this.actualizarIngreso.servicio = '';
    



    if (this.actualizarIngreso.op_tipoemision !== 'factura') {
      this.actualizarIngreso.monto = 0;
      this.actualizarIngreso.detalle = '';
      this.actualizarIngreso.importe_total = 0;
    }
    if (this.actualizarIngreso.op_tipoemision === 'factura') {
      this.actualizarIngreso.num_recibo = 0;
      this.actualizarIngreso.cerrado = 'SI';
      this.actualizarIngreso.tipo_emision = 'FACTURA';
    }
    else if (this.actualizarIngreso.op_tipoemision === 'recibo') {
      this.actualizarIngreso.num_factura = 0;
      this.actualizarIngreso.cerrado = 'SI';
      this.actualizarIngreso.tipo_emision = 'RECIBO';
    }
    else if (this.actualizarIngreso.op_tipoemision === 'documento') {
      this.actualizarIngreso.num_depo = 0;
      this.actualizarIngreso.tipo_emision = 'DOCUMENTO';
      this.actualizarIngreso.cerrado = '';
      this.actualizarIngreso.estado = '';
    }

  }


  actualizarRegistro() {


    // if (this.actualizarIngreso.cerrado === 'SI') {
    //   Swal.fire({
    //     title: 'Registro con estado PENDIENTE',
    //     text: '¿Está seguro de Consolidar el Registro?',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Sí, consolidar',
    //     cancelButtonText: 'Cancelar'
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       this.actualizarIngreso.estado = 'CONSOLIDADO';
    //       // Proceed with the update after confirmation
    //       this.proceedUpdate();
    //     }
    //   });
    //   return;
    // } 
    // else {
    //   if (this.actualizarIngreso.cerrado === 'NO') {
    //     Swal.fire('Registro con estado Consolidado', 'Un registro Consolidado no puede volver a Pendiente.', "info");
    //     return;

    //   }
    // }
    //this.proceedUpdate();
  //}
  // If cerrado !== 'NO', proceed normally
  // proceedUpdate() {

  //   switch (this.actualizarIngreso.op_tipoemision) {
  //     case 'factura':
  //       this.actualizarIngreso.num_recibo = 0;
  //       // this.getNextNumDeposito();
  //       this.actualizarIngreso.tipo_emision = 'FACTURA';
  //       break;
  //     case 'documento':
  //       this.actualizarIngreso.num_recibo = 0;
  //       // this.getNextNumDeposito();
  //       this.actualizarIngreso.tipo_emision = 'DOCUMENTO';
  //       break;
  //     case 'recibo':
  //     default:
  //       this.actualizarIngreso.num_factura = 0;
  //       // this.getNextNumFactura();
  //       this.actualizarIngreso.tipo_emision = 'RECIBO';
  //       break;
  //   }


    this.submitted = true;

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
    this.ingresoService.updateIngresos(this.actualizarIngreso, this.rutaActiva.snapshot.params['id_ingresos'])
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.button = 'Actualizar';
          Swal.fire('Registro Exitoso', res.message || 'El ingreso se actualizó correctamente.', 'success');
          this.goBack();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.button = 'Actualizar';
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
