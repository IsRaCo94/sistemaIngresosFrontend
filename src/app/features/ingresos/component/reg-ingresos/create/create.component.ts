import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ingresos } from '../../../../models/ingresos';
import { empresa } from '../../../../models/empresa';
import { IngresosService } from '../../../../service/ingresos.service';
import Swal from 'sweetalert2';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TipoIngreso } from '../../../../models/TipoIngreso';
import { DetalleRubrosService } from '../../../../service/detalle-rubros.service';
import { RubrosDetalle } from '../../../../models/rubrosDetalle';
import { persona } from '../../../../models/persona';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  public loading: boolean = false;
  ingresoFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  nuevoIngreso = new ingresos();
  tipoIngresos: TipoIngreso[] = [];
  tipoRubros: RubrosDetalle[] = [];
  showAmortizacion: boolean = false;
  showDemasia: boolean = false;
  isCardCollapsed: boolean = false;
  excelFileToImport: File | null = null;
  excelPreview: any[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private ingresoService: IngresosService,
    private tipoingresoService: IngresosService,
    private rubrosService: DetalleRubrosService,
    private _location: Location,

  ) {

  }
  collapseCard() {
    this.isCardCollapsed = !this.isCardCollapsed;
  }
  ngOnInit(): void {

    if (!this.nuevoIngreso.fecha) {
      this.nuevoIngreso.fecha = new Date();


    }
    if (!this.nuevoIngreso.fecha_reg) {
      this.nuevoIngreso.fecha_reg = new Date();
    }
    this.ingresoFormGroup = this._formBuilder.group({
      num_recibo: ['', Validators.required],
      num_depo: ['', Validators.required],
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
      op_deposito_dema: ['', Validators.required],
      op_amortizacion_pagos: ['', Validators.required],
      num_factura: ['', Validators.required],
      id_tipo_rubro: ['', Validators.required],
      op_tipoemision: ['', Validators.required],
      importe_total: ['', Validators.required],
    });
    this.iniIngreso()
    this.getTipoRubro()
    this.getTipoIngreso()
    // this.getNextNumDeposito();
    this.calculateCostoTotal();
    // this.getNextNumFactura();
    this.onOpTipoEmisionChange(this.nuevoIngreso.op_tipoemision);

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
        if (this.nuevoIngreso.tipo_emision === 'FACTURA') {
          this.nuevoIngreso.proveedor = data.proveedor;
          // Remove prefix if present
          const prefix = 'PRECIO Unidad (Servicios) ';
          let detalle = data.detalle || '';
          if (detalle.startsWith(prefix)) {
            detalle = detalle.substring(prefix.length);
          }
          this.nuevoIngreso.detalle = detalle; // Assign cleaned string here
          this.nuevoIngreso.monto = data.monto;
          this.nuevoIngreso.num_factura = data.num_factura;
          this.nuevoIngreso.nit = data.nit;
          const fechaISO = data.fecha; // "2025-08-29T00:00:00.000Z"
          const fechaLocal = new Date(fechaISO);
          const fechaCorregida = new Date(fechaLocal.getTime() + fechaLocal.getTimezoneOffset() * 60000);
          this.nuevoIngreso.fecha = fechaCorregida;
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
        const fechaStr = this.nuevoIngreso.fecha ? 
          new Date(this.nuevoIngreso.fecha).toLocaleDateString('es-ES') : '';
  
        // Find the rubro object matching the selected id_tipo_rubro
        const rubro = this.tipoRubros.find(r => r.id_detalle_rubro === this.nuevoIngreso.id_tipo_rubro);
  
        return {
          num_depo: row[0] ?? '',
          proveedor: row[1] ?? '',
          importe_total: importe_total.toFixed(2),
          fecha: fechaStr,  // Use fixed date here
          lugar: this.nuevoIngreso.lugar,
          id_tipo_ingr_id: this.nuevoIngreso.id_tipo_ingr_id,
          tipo_ingres: this.nuevoIngreso.tipo_ingres,
          id_tipo_rubro: this.nuevoIngreso.id_tipo_rubro,
          nombre: rubro ? rubro.nombre : '',
          num_rubro: rubro ? rubro.num_rubro : '',
          servicio: rubro ? rubro.servicio : '',
          detalle: this.nuevoIngreso.detalle || ''
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
 
  iniIngreso() {

    this.nuevoIngreso.lugar
    this.nuevoIngreso.estado = 'CONSOLIDADO'
    this.nuevoIngreso.cuenta = '1-45990921'
    this.nuevoIngreso.id_tipo_ingr_id = ''
    this.nuevoIngreso.monto;
    this.nuevoIngreso.multas = 0;
    this.nuevoIngreso.intereses = 0;
    this.nuevoIngreso.aportes_patro = 0;
    this.nuevoIngreso.deposito_dema = 0;
    this.nuevoIngreso.amortizacion_pagos = 0;
    this.nuevoIngreso.num_factura = 0;
    this.nuevoIngreso.num_recibo = 0;
    this.nuevoIngreso.num_depo;
    this.nuevoIngreso.cerrado = 'SI';
    this.nuevoIngreso.id_tipo_rubro = '';
    this.nuevoIngreso.op_tipoemision;
    this.nuevoIngreso.importe_total;


    //this.nuevoIngreso.detalle = '';

  }
  get f() { return this.ingresoFormGroup.controls; }

  goBack() {
    this._location.back();
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
    //this.selectedItem = 3;
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

    this.nuevoIngreso.proveedor = $event.EMP_NOM;
    //this.nuevoIngreso.id_empresa_id = $event.EMP_COD;
    this.nuevoIngreso.cod_prove = $event.EMP_COD;
    this.nuevoIngreso.nit = $event.EMP_NIT;
    if (this.nuevoIngreso.op_tipoemision !== 'factura') {
      this.nuevoIngreso.nit = 0;
    }
    console.log('recibe:', this.nuevoIngreso.cod_prove);

  }
  receiveMessagePersona($event: any) {
    this.nuevoIngreso.proveedor = $event.nombre;
    this.nuevoIngreso.cod_prove = $event.id_persona;

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
      this.nuevoIngreso.id_tipo_ingr_id = tipos.id_tipo_ingr;
      this.nuevoIngreso.tipo_ingres = tipos.tipo_ingr;
    } else {
      this.nuevoIngreso.id_tipo_ingr_id = '';
      this.nuevoIngreso.tipo_ingres = '';
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
      this.nuevoIngreso.id_tipo_rubro = tipos.id_detalle_rubro;
      this.nuevoIngreso.servicio = tipos.servicio;
      this.nuevoIngreso.nombre = tipos.nombre;
      this.nuevoIngreso.servicio = tipos.servicio;
      this.nuevoIngreso.num_rubro = tipos.num_rubro;
      this.updateDetalle();
      // <-- Add this line to update detalle on rubro change
    } else {
      this.nuevoIngreso.id_tipo_rubro = '';
      this.nuevoIngreso.nombre = '';

    }
    console.log('recibo', this.nuevoIngreso.num_rubro);

  }


  getNextNumDeposito() {
    this.ingresoService.getLastNumDeposito().subscribe({
      next: (lastNum: number) => {
        // Start from 1000 if lastNum is less than 1000
        this.nuevoIngreso.num_recibo = lastNum >= 1000 ? lastNum++ : 1000;
      },
      error: (error) => {
        console.error('Error fetching last num_depo:', error);
        this.nuevoIngreso.num_recibo = 1000; // fallback start from 1000
      }
    });
  }
  getNextNumFactura() {

    this.ingresoService.getLastNumFactura().subscribe({
      next: (lastNum: number) => {
        // Start from 1000 if lastNum is less than 1000
        this.nuevoIngreso.num_factura = lastNum >= 100 ? lastNum++ : 100;
      },
      error: (error) => {
        console.error('Error fetching last num_factura:', error);
        this.nuevoIngreso.num_factura = 100; // fallback start from 1000
      }
    });
  }
  calculateCostoTotal(): void {
    const amortizacion_pagos = Number(this.nuevoIngreso.amortizacion_pagos) || 0;
    const deposito_dema = Number(this.nuevoIngreso.deposito_dema) || 0;
    const monto = Number(this.nuevoIngreso.monto) || 0;
    this.nuevoIngreso.importe_total = parseFloat((monto + amortizacion_pagos + deposito_dema).toFixed(2));
  }
  calculateCostoTotal2(): void {
    const monto = Number(this.nuevoIngreso.monto) || 0;
    this.nuevoIngreso.importe_total = parseFloat((monto).toFixed(2));
  }


  updateDetalle() {
    if (this.nuevoIngreso.tipo_emision !== 'RECIBO' && this.nuevoIngreso.tipo_emision !== 'DOCUMENTO') {
      return;
    }

    let detalleParts = [];

    if (this.nuevoIngreso.servicio === 'VENTA DE CARNETS DE ASEGURADO') {
      this.nuevoIngreso.detalle = 'VENTA DE CARNETS';
      return;
    }
    if (this.nuevoIngreso.servicio === 'VENTA DE FORMULARIOS DE APORTES') {
      this.nuevoIngreso.detalle = 'APORTE PATRONAL MES DE';
      return;
    }
    if (this.nuevoIngreso.servicio === 'FORMULARIOS DE NOVEDADES') {
      this.nuevoIngreso.detalle = 'FORMULARIOS DE NOVEDADES';
      return;
    }
    if (this.nuevoIngreso.servicio === 'VENTA DE EXAMENES POST OCUPACIONALES') {
      this.nuevoIngreso.detalle = 'VENTA DE FORMULARIOS POST OCUPACIONALES';
      return;
    }
    if (this.nuevoIngreso.servicio === 'VENTA DE EXAMENES PRE OCUPACIONALES') {
      this.nuevoIngreso.detalle = 'VENTA DE FORMULARIOS PRE OCUPACIONALES';
      return;
    }

    if (this.nuevoIngreso.servicio === 'MULTAS POR BAJA DEL ASEGURADO') {
      this.nuevoIngreso.detalle = 'MULTAS POR BAJA DEL ASEGURADO';
      return;
    }
    if (this.nuevoIngreso.servicio === 'MULTAS FISCALIZACION APORTES NO COTIZADOS') {
      this.nuevoIngreso.detalle = 'MULTAS FICALIZACION APORTES NO COTIZADOS';
      return;
    }
    if (this.nuevoIngreso.servicio === 'MULTAS POR INCUMPLIMIENTOS A CONTRATOS') {
      this.nuevoIngreso.detalle = 'MULTAS POR INCUMPLIMIENTOS A CONTRATOS';
      return;
    }
    if (this.nuevoIngreso.servicio === 'MULTAS INCUMPLIMIENTO PRESENTACION DE PLANILLAS') {
      this.nuevoIngreso.detalle = 'MULTAS INCUMPLIMIENTO PRESENTACION DE PLANILLAS';
      return;
    }
    if (this.nuevoIngreso.servicio === 'VENTA DE BIDONES') {
      this.nuevoIngreso.detalle = 'VENTA DE BIDONES';
      return;
    }
    if (this.nuevoIngreso.servicio === 'RECAUDACION POR INTERNADO ROTATORIO') {
      this.nuevoIngreso.detalle = 'RECAUDACION POR INTERNADO ROTATORIO';
      return;
    }
    if (this.nuevoIngreso.servicio === 'APORTES PATRONALES Y APORTES (PRIVADO)') {
      this.nuevoIngreso.detalle = 'APORTES PATRONALES APORTES (PRIVADO)';
      return;
    }
    if (this.nuevoIngreso.servicio === 'APORTES PATRONALES Y APORTES (PUBLICO)') {
      this.nuevoIngreso.detalle = 'APORTES PATRONALES APORTES (PUBLICO)';
      return;
    }

    if (this.nuevoIngreso.op_deposito_dema) {
      detalleParts.push('DEPOSITO EN DEMASIA');
    }
    if (this.nuevoIngreso.op_amortizacion_pagos) {
      detalleParts.push('AMORTIZACIÓN MENSUAL DE CONVENIO DE PLAN DE PAGOS:');
    }
    this.nuevoIngreso.detalle = detalleParts.join(' - ');
  }
  onOpAportesPatroChange() {
    this.updateDetalle();
  }

  onOpAmortizacionPagosChange() {
    this.updateDetalle();
  }

  onOpTipoEmisionChange($event: any) {
    // Reset fields related to proveedor and others as needed
    this.nuevoIngreso.proveedor = '';
    this.nuevoIngreso.lugar;
    this.nuevoIngreso.fecha;
    this.nuevoIngreso.tipo_ingres
    this.nuevoIngreso.estado = 'CONSOLIDADO';
    this.nuevoIngreso.id_tipo_ingr_id = '';
    this.nuevoIngreso.tipo_ingres = '';
    this.nuevoIngreso.venta_form = 0;
    this.nuevoIngreso.venta_serv = 0;
    this.nuevoIngreso.inter_rota = 0;
    this.nuevoIngreso.id_tipo_rubro = '';
    this.nuevoIngreso.detalle = '';
    this.nuevoIngreso.servicio = '';
    //this.nuevoIngreso.monto = 0;
    this.nuevoIngreso.importe_total;



    if (this.nuevoIngreso.op_tipoemision !== 'factura') {
      this.nuevoIngreso.monto;
      this.nuevoIngreso.detalle = '';
    }
    if (this.nuevoIngreso.op_tipoemision === 'factura') {
      this.nuevoIngreso.num_recibo = 0;
      this.nuevoIngreso.cerrado = 'SI';
      this.nuevoIngreso.tipo_emision = 'FACTURA';
    }
    else if (this.nuevoIngreso.op_tipoemision === 'recibo') {
      this.nuevoIngreso.num_factura = 0;
      this.nuevoIngreso.cerrado = 'SI';
      this.nuevoIngreso.tipo_emision = 'RECIBO';
    }
    else if (this.nuevoIngreso.op_tipoemision === 'documento') {
      this.nuevoIngreso.num_depo;
      this.nuevoIngreso.tipo_emision = 'DOCUMENTO';
      this.nuevoIngreso.cerrado = '';
      this.nuevoIngreso.estado = '';
      this.nuevoIngreso.cerrado = 'SI'
      this.nuevoIngreso.estado = 'CONSOLIDADO'

    }

  }


  // guardarRegistro() {

  //   switch (this.nuevoIngreso.op_tipoemision) {
  //     case 'factura':
  //       this.nuevoIngreso.num_recibo = 0;
  //       // this.getNextNumDeposito();
  //       this.nuevoIngreso.tipo_emision = 'FACTURA';
  //       break;
  //     case 'documento':
  //       this.nuevoIngreso.num_recibo = 0;
  //       // this.getNextNumDeposito();
  //       this.nuevoIngreso.tipo_emision = 'DOCUMENTO';
  //       break;
  //     case 'recibo':
  //     default:
  //       this.nuevoIngreso.num_factura = 0;
  //       // this.getNextNumFactura();
  //       this.nuevoIngreso.tipo_emision = 'RECIBO';
  //       break;
  //   }

  //   //Solo validar campos obligatorios si es una recibo
  //   switch (this.nuevoIngreso.tipo_emision) {
  //     case 'FACTURA':
  //       const camposObligatorios = [
  //         this.nuevoIngreso.num_factura,
  //         this.nuevoIngreso.lugar,
  //         this.nuevoIngreso.proveedor,
  //         this.nuevoIngreso.nit,
  //         this.nuevoIngreso.cerrado,
  //         this.nuevoIngreso.estado,
  //         this.nuevoIngreso.id_tipo_ingr_id,
  //         this.nuevoIngreso.id_tipo_rubro,
  //         this.nuevoIngreso.monto,
  //         this.nuevoIngreso.importe_total
  //       ];

  //       if (camposObligatorios.some(campo => !campo)) {
  //         Swal.fire('Campos obligatorios', 'Para facturas, complete todos los campos requeridos.', 'warning');
  //         return;
  //       }
  //       break;

  //     case 'RECIBO':
  //       const camposObligatorios2 = [
  //         this.nuevoIngreso.num_recibo,
  //         this.nuevoIngreso.lugar,
  //         this.nuevoIngreso.proveedor,
  //         // this.nuevoIngreso.nit,
  //         this.nuevoIngreso.cerrado,
  //         this.nuevoIngreso.estado,
  //         this.nuevoIngreso.id_tipo_ingr_id,
  //         this.nuevoIngreso.id_tipo_rubro,
  //         this.nuevoIngreso.monto,
  //         this.nuevoIngreso.importe_total
  //       ];

  //       if (camposObligatorios2.some(campo2 => !campo2)) {
  //         Swal.fire('Campos obligatorios', 'Para recibos, complete todos los campos requeridos.', 'warning');
  //         return;
  //       }
  //       break;
  //   }
  //   this.isLoading = true;
  //   this.button = 'Procesando..';

  //   this.ingresoService.postIngresos(this.nuevoIngreso)
  //     .subscribe({
  //       next: (res: any) => {
  //         this.isLoading = false;
  //         this.button = 'Guardar';
  //         Swal.fire('Registro Exitoso', res.message || 'El ingreso se registró correctamente.', 'success');
  //         this.goBack();
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         this.isLoading = false;
  //         this.button = 'Guardar';
  //         console.error('Error al guardar registro:', error);
  //         if (error.status === 500) {
  //           const errorMessage = error.error?.message || 'El código ingresado ya existe. Por favor, intente con otro.';
  //           Swal.fire('Advertencia', errorMessage, 'warning');
  //         } else if (error.status === 400) {
  //           const errorMessage = error.error?.message || 'Datos de la solicitud inválidos. Por favor, verifique la información.';
  //           Swal.fire('Error de Datos', errorMessage, 'error');
  //         } else {
  //           Swal.fire('Error', 'Ocurrió un error inesperado al intentar guardar el registro. Por favor, intente de nuevo.', 'error');
  //         }
  //       }
  //     });

  //   console.log(this.nuevoIngreso);

  // }
  guardarRegistro() {
    if (this.excelPreview.length > 0 && this.nuevoIngreso.op_tipoemision === 'documento') {
      this.isLoading = true;
      const saveObservables = this.excelPreview.map(row => {
        const ingresoToSave = new ingresos();
        ingresoToSave.num_depo = row.num_depo;
        ingresoToSave.proveedor = row.proveedor;
        ingresoToSave.importe_total = parseFloat(row.importe_total);
  
        // Parse date string "dd/mm/yyyy" to Date object
        if (row.fecha) {
          const parts = row.fecha.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // JS months 0-based
            const year = parseInt(parts[2], 10);
            ingresoToSave.fecha = new Date(year, month, day);
          } else {
            ingresoToSave.fecha = new Date(row.fecha); // fallback
          }
        } else {
          ingresoToSave.fecha = new Date(); // fallback current date
        }
  
        ingresoToSave.lugar = row.lugar;
        ingresoToSave.detalle = row.detalle || '';
        ingresoToSave.monto = parseFloat(row.importe_total);
        ingresoToSave.estado = 'CONSOLIDADO';
        ingresoToSave.cerrado = 'SI';
        ingresoToSave.fecha_reg = new Date();
        ingresoToSave.num_recibo = 0;
        ingresoToSave.cuenta = '1-45990921';
        ingresoToSave.tipo_emision = 'DOCUMENTO';
        ingresoToSave.num_factura = 0;
        ingresoToSave.nit = 0;
        ingresoToSave.num_rubro = row.num_rubro || '';
        ingresoToSave.servicio = row.servicio || '';
        ingresoToSave.nombre = row.nombre || '';
  
        ingresoToSave.tipo_ingres = row.tipo_ingres || '';
        ingresoToSave.id_tipo_ingr_id = row.id_tipo_ingr_id || '';
        ingresoToSave.id_tipo_rubro = row.id_tipo_rubro || '';
  
        return this.ingresoService.postIngresos(ingresoToSave);
      });
  
      forkJoin(saveObservables).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Éxito', 'Todos los registros fueron guardados correctamente.', 'success');
          this.goBack();
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error', 'Ocurrió un error al guardar los registros.', 'error');
          console.error(err);
        }
      });
    } else if (this.nuevoIngreso.op_tipoemision !== 'documento') {
      // Save single ingreso if not documento
      switch (this.nuevoIngreso.op_tipoemision) {
        case 'factura':
          this.nuevoIngreso.num_recibo = 0;
          this.nuevoIngreso.tipo_emision = 'FACTURA';
          break;
        case 'recibo':
        default:
          this.nuevoIngreso.num_factura = 0;
          this.nuevoIngreso.tipo_emision = 'RECIBO';
          break;
      }
  
      // Validation logic as in your existing guardarRegistro method
      // ...
  
      this.isLoading = true;
      this.ingresoService.postIngresos(this.nuevoIngreso)
        .subscribe({
          next: (res: any) => {
            this.isLoading = false;
            Swal.fire('Registro Exitoso', res.message || 'El ingreso se registró correctamente.', 'success');
            this.goBack();
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading = false;
            Swal.fire('Error', 'Ocurrió un error al guardar el registro.', 'error');
            console.error('Error al guardar registro:', error);
          }
        });
    }
  }
}
