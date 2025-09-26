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
import { persona } from '../../../../models/persona';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

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
  excelFileToImport: File | null = null;
  excelPreview: any[] = [];
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
    persona = new persona;
  personas: persona[] = [];
  proveedor = new empresa;
  proveedores: empresa[] = [];
  selectedItem: any;
  

  titleCard = '';


  setSelectedItem(item: any) {
    this.selectedItem = item;
  }
  setModalProveedor() {
    this.selectedItem = 1;
    console.log(this.selectedItem);
    
  }

  setSelectedItem2(item: any) {
    this.selectedItem = item;
  }
  setModalPersona() {
    this.selectedItem = 2;
    console.log(this.selectedItem);
    
  }
  receiveMessageImportDocumento($event: ingresos) {
   
  }
  //   receiveMessageProveedor($event: any) {

  //     this.nuevoIngreso.proveedor = $event.nombre
  //     this.nuevoIngreso.id_empresa_id = $event.id_empresa
  //     this.nuevoIngreso.cod_prove = $event.id_empresa
  //     this.nuevoIngreso.nit = $event.nit;
  //     if (this.nuevoIngreso.op_tipoemision !== 'factura') {
  //       this.nuevoIngreso.nit = 0;
  //     }
  // console.log('recibe:', this.nuevoIngreso.cod_prove);

  //   }
  receiveMessageProveedor($event: any) {

    this.actualizarIngreso.proveedor = $event.EMP_NOM;
    //this.nuevoIngreso.id_empresa_id = $event.EMP_COD;
    this.actualizarIngreso.cod_prove = $event.EMP_COD;
    this.actualizarIngreso.nit = $event.EMP_NIT;
    if (this.actualizarIngreso.op_tipoemision !== 'factura') {
      this.actualizarIngreso.nit = 0;
    }
    console.log('recibe:', this.actualizarIngreso.cod_prove);

  }
  receiveMessagePersona($event: any) {
    this.actualizarIngreso.proveedor = $event.nombre;
    
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
            // Filter out items where baja is true
            this.tipoRubros = response.filter((item: any) => !item.baja);
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
    console.log('recibo', this.actualizarIngreso.num_rubro);

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
  onPdfSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire({
          icon: 'error',
          title: 'Archivo inválido',
          text: 'Por favor, seleccione un archivo PDF válido.',
        });
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      this.ingresoService.extractPdfData(formData).subscribe((data: any) => {
        console.log('Datos recibidos del PDF:', data);
        if (this.actualizarIngreso.tipo_emision === 'FACTURA') {
          this.actualizarIngreso.proveedor = data.proveedor;
          // Remove prefix if present
          const prefix = 'PRECIO Unidad (Servicios) ';
          let detalle = data.detalle || '';
          if (detalle.startsWith(prefix)) {
            detalle = detalle.substring(prefix.length);
          }
          this.actualizarIngreso.detalle = detalle; // Assign cleaned string here
          this.actualizarIngreso.monto = data.monto;
          this.actualizarIngreso.num_factura = data.num_factura;
          this.actualizarIngreso.nit = data.nit;
          const fechaISO = data.fecha; // "2025-08-29T00:00:00.000Z"
          const fechaLocal = new Date(fechaISO);
          const fechaCorregida = new Date(fechaLocal.getTime() + fechaLocal.getTimezoneOffset() * 60000);
          this.actualizarIngreso.fecha = fechaCorregida;
          this.calculateCostoTotal2();
          Swal.fire({
            icon: 'success',
            title: 'Importación exitosa',
            text: 'El PDF fue importado y los datos se completaron correctamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }  
  }
  onFileChange(evt: any) {
    const file = evt.target.files[0];
    if (!file) {
      Swal.fire('Error', 'Debe seleccionar un archivo.', 'error');
      return;
    }
  
    // Validar extensión de archivo
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
      Swal.fire('Error', 'Solo se permiten archivos de Excel (.xlsx, .xls).', 'error');
      return;
    }
  
    this.excelFileToImport = file;
  
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
      // Validar encabezados
      const headers = data[0] || [];
      const expectedHeaders = ['Nro. DEPOSITO', 'DESCRIPCIÓN', 'IMPORTE TOTAL', 'FECHA'];
      const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
      const headersValid = expectedHeaders.every((h, i) => normalize(headers[i] || '') === normalize(h));
  
      if (!headersValid) {
        Swal.fire('Error', 'El archivo debe tener las columnas: ' + expectedHeaders.join(', '), 'error');
        return;
      }
  
      // Validar que haya al menos un dato
      if (data.length <= 1) {
        Swal.fire('Error', 'El archivo no contiene datos para importar.', 'error');
        return;
      }
  
      // Mapear datos, asegurando que cada fila sea un array
      this.excelPreview = data.slice(1).map((row: any[]) => {
        // Convert importe_total to number with 2 decimals
        let importe = row[2];
        if (typeof importe === 'string') {
          importe = importe.replace(',', '.'); // Replace comma decimal separator if any
        }
        const importe_total = parseFloat(importe) || 0;
  
        // Instead of using Excel date, use this.nuevoIngreso.fecha formatted as dd/mm/yyyy
        const fechaStr = this.actualizarIngreso.fecha ? 
          new Date(this.actualizarIngreso.fecha).toLocaleDateString('es-ES') : '';
  
        // Find the rubro object matching the selected id_tipo_rubro
        const rubro = this.tipoRubros.find(r => r.id_detalle_rubro === this.actualizarIngreso.id_tipo_rubro);
  
        return {
          num_depo: row[0] ?? '',
          proveedor: row[1] ?? '',
          importe_total: importe_total.toFixed(2),
          fecha: fechaStr,  // Use fixed date here
          lugar: this.actualizarIngreso.lugar,
          id_tipo_ingr_id: this.actualizarIngreso.id_tipo_ingr_id,
          tipo_ingres: this.actualizarIngreso.tipo_ingres,
          id_tipo_rubro: this.actualizarIngreso.id_tipo_rubro,
          nombre: rubro ? rubro.nombre : '',
          num_rubro: rubro ? rubro.num_rubro : '',
          servicio: rubro ? rubro.servicio : '',
          detalle: this.actualizarIngreso.detalle || ''
        };
      });
  
      // Validar que todos los campos requeridos estén presentes en cada fila
      const datosValidos = this.excelPreview.every(ingre =>
        ingre.num_depo && ingre.proveedor && ingre.importe_total && ingre.fecha
      );
      if (!datosValidos) {
        Swal.fire('Error', 'Todos los campos son obligatorios en cada fila.', 'error');
        return;
      }
  
      // Mostrar el modal de importación
      this.selectedItem = 3;
    };
    reader.readAsBinaryString(file);
  }

  updateDetalle() {
    if (this.actualizarIngreso.tipo_emision !== 'RECIBO' && this.actualizarIngreso.tipo_emision !== 'DOCUMENTO') {
      return;
    }
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
      this.actualizarIngreso.num_depo;
      this.actualizarIngreso.tipo_emision = 'DOCUMENTO';
      this.actualizarIngreso.cerrado = '';
      this.actualizarIngreso.estado = '';
    }

  }


  actualizarRegistro() {


    switch (this.actualizarIngreso.op_tipoemision) {
      case 'factura':
        this.actualizarIngreso.num_recibo = 0;
        // this.getNextNumDeposito();
        this.actualizarIngreso.tipo_emision = 'FACTURA';
        break;
      case 'documento':
        this.actualizarIngreso.num_recibo = 0;
        // this.getNextNumDeposito();
        this.actualizarIngreso.tipo_emision = 'DOCUMENTO';
        break;
      case 'recibo':
      default:
        this.actualizarIngreso.num_factura = 0;
        // this.getNextNumFactura();
        this.actualizarIngreso.tipo_emision = 'RECIBO';
        break;
    }

    //Solo validar campos obligatorios si es una recibo
    switch (this.actualizarIngreso.tipo_emision) {
      case 'FACTURA':
        const camposObligatorios = [
          this.actualizarIngreso.num_factura,
          this.actualizarIngreso.lugar,
          this.actualizarIngreso.proveedor,
          this.actualizarIngreso.nit,
          this.actualizarIngreso.cerrado,
          this.actualizarIngreso.estado,
          this.actualizarIngreso.id_tipo_ingr_id,
          this.actualizarIngreso.id_tipo_rubro,
          this.actualizarIngreso.monto,
          this.actualizarIngreso.importe_total
        ];

        if (camposObligatorios.some(campo => !campo)) {
          Swal.fire('Campos obligatorios', 'Para facturas, complete todos los campos requeridos.', 'warning');
          return;
        }
        break;

      case 'RECIBO':
        const camposObligatorios2 = [
          this.actualizarIngreso.num_recibo,
          this.actualizarIngreso.lugar,
          this.actualizarIngreso.proveedor,
          // this.nuevoIngreso.nit,
          this.actualizarIngreso.cerrado,
          this.actualizarIngreso.estado,
          this.actualizarIngreso.id_tipo_ingr_id,
          this.actualizarIngreso.id_tipo_rubro,
          this.actualizarIngreso.monto,
          this.actualizarIngreso.importe_total
        ];

        if (camposObligatorios2.some(campo2 => !campo2)) {
          Swal.fire('Campos obligatorios', 'Para recibos, complete todos los campos requeridos.', 'warning');
          return;
        }
        break;
    }
    this.isLoading = true;
    this.button = 'Procesando..';

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

      console.log(this.actualizarIngreso);
      
  }

}
