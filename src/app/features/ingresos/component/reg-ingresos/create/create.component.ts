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
import { data } from 'jquery';
import { SafeUrlPipe } from '../../../../../shared/pipes/safe-url.pipe';
import { EmpresaService } from '../../../../service/empresa.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',

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
  pdfSrc: string | null = null;  // Agrega esta propiedad


  constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private ingresoService: IngresosService,
    private tipoingresoService: IngresosService,
    private rubrosService: DetalleRubrosService,
    private _location: Location,
    private empresaService: EmpresaService,
  

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
    this.getNextNumRecibo();
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
      this.pdfSrc = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append('file', file);
      this.ingresoService.extractPdfData(formData).subscribe((data: any) => {
        console.log('Datos recibidos del PDF:', data);
        if (this.nuevoIngreso.tipo_emision === 'FACTURA') {
          this.nuevoIngreso.proveedor = data.proveedor;
          const prefix = 'PRECIO Unidad (Servicios) ';
          let detalle = data.detalle || '';
          if (detalle.startsWith(prefix)) {
            detalle = detalle.substring(prefix.length);
          }
          this.nuevoIngreso.detalle = detalle;
          this.nuevoIngreso.monto = data.monto;
          this.nuevoIngreso.num_factura = data.num_factura;
          this.nuevoIngreso.nit = data.nit;
          const fechaISO = data.fecha;
          const fechaLocal = new Date(fechaISO);
          const fechaCorregida = new Date(fechaLocal.getTime() + fechaLocal.getTimezoneOffset() * 60000);
          this.nuevoIngreso.fecha = fechaCorregida;
          this.calculateCostoTotal2();
  
          this.empresaService.getAllEmpresas().subscribe(response => {
            const empresasArray = response.empresas;
            const matchedEmpresa = empresasArray.find((emp: empresa) =>
              String(emp.EMP_NIT) === String(this.nuevoIngreso.nit)
            );
            if (matchedEmpresa) {
              this.nuevoIngreso.cod_prove = matchedEmpresa.EMP_COD;
              Swal.fire({
                icon: 'success',
                title: 'Importación exitosa',
                text: 'El PDF fue importado y los datos se completaron correctamente.',
                confirmButtonText: 'Aceptar'
              });
            } else {
              // Verificar también en getEmpresa() antes de preguntar al usuario
              this.empresaService.getEmpresa().subscribe(empresasResponse => {
                const empresasArray2 = empresasResponse.empresas || empresasResponse;
                const matchedEmpresa2 = empresasArray2.find((emp: empresa) =>
                  String(emp.EMP_NIT || emp.nit) === String(this.nuevoIngreso.nit)
                );
                
                if (matchedEmpresa2) {
                  this.nuevoIngreso.cod_prove = matchedEmpresa2.EMP_COD || matchedEmpresa2.codigo;
                  Swal.fire({
                    icon: 'success',
                    title: 'Importación exitosa',
                    text: 'El PDF fue importado y los datos se completaron correctamente.',
                    confirmButtonText: 'Aceptar'
                  });
                } else {
                  Swal.fire({
                    icon: 'question',
                    title: 'Proveedor no encontrado',
                    text: 'El proveedor con este NIT no existe. ¿Desea agregarlo para futuras verificaciones?',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, agregar',
                    cancelButtonText: 'No, cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const newEmpresa: empresa = {
                        id_empresa: 0,
                        codigo: '',
                        nombre: this.nuevoIngreso.proveedor,
                        nit: this.nuevoIngreso.nit,
                        baja: false,
                        EMP_NIT: String(this.nuevoIngreso.nit),
                        EMP_NOM: this.nuevoIngreso.proveedor,
                        EMP_COD: '',
                        EMP_NPATRONAL: '',
                        TIPO: ''
                      };
  
                      this.empresaService.getEmpresa().subscribe(empresas => {
                        const empresasArray3 = empresas.empresas || empresas;
                        const exists = empresasArray3.some((emp: empresa) =>
                          String(emp.EMP_NIT || emp.nit) === String(this.nuevoIngreso.nit)
                        );
                        if (exists) {
                          Swal.fire('Información', 'El proveedor ya existe en la base de datos.', 'info');
                        } else {
                          this.empresaService.postEmpresa(newEmpresa).subscribe({
                            next: (response: any) => {
                              const createdEmpresa = response as empresa;
                              this.nuevoIngreso.cod_prove = createdEmpresa.codigo || createdEmpresa.EMP_COD;
                              Swal.fire('Proveedor agregado', 'El proveedor fue agregado para futuras verificaciones.', 'success');
                            },
                            error: (err) => {
                              console.error('Error agregando proveedor:', err);
                              Swal.fire('Error', 'No se pudo agregar el proveedor.', 'error');
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  }
  verifyNit() {
    console.log('verifyNit llamado, nit:', this.nuevoIngreso.nit, 'proveedor:', this.nuevoIngreso.proveedor);
    if (!this.nuevoIngreso.nit && !this.nuevoIngreso.proveedor) {
      Swal.fire('Error', 'El NIT y el proveedor están vacíos.', 'error');
      return;
    }
  
    forkJoin({
      allEmpresasResponse: this.empresaService.getAllEmpresas(),
      empresasResponse: this.empresaService.getEmpresa()
    }).subscribe({
      next: ({ allEmpresasResponse, empresasResponse }) => {
        // Extract arrays from responses, adjust if needed
        const allEmpresasArray = allEmpresasResponse.empresas ?? allEmpresasResponse;
        const empresasArray = empresasResponse.empresas ?? empresasResponse;
  
        // Merge both arrays
        const combinedEmpresas = [...allEmpresasArray, ...empresasArray];
  
        // Remove duplicates by NIT (optional)
        const uniqueEmpresasMap = new Map<string, empresa>();
        combinedEmpresas.forEach(emp => {
          uniqueEmpresasMap.set(String(emp.EMP_NIT ?? emp.nit), emp);
        });
        const uniqueEmpresas = Array.from(uniqueEmpresasMap.values());
  
        // Check if NIT exists
        const match = uniqueEmpresas.find((emp: empresa) =>
          this.nuevoIngreso.nit && String(emp.EMP_NIT ?? emp.nit) === String(this.nuevoIngreso.nit)
        );
  
        if (match) {
          Swal.fire('Éxito', 'El Nit y el Proveedor existen.', 'success');
        } else {
          Swal.fire('Información', 'El Nit y el Proveedor no existen.', 'info');
        }
      },
      error: (error) => {
        console.error('Error al obtener empresas', error);
        Swal.fire('Error', 'Error al verificar el NIT y proveedor.', 'error');
      }
    });
  }

  checkAndAddCarnetCI() {
    if (this.nuevoIngreso.servicio !== 'VENTA DE CARNETS DE ASEGURADO') {
      return;
    }
  
    // Si el campo CI está vacío (0 o null/undefined), mostrar Swal para ingresar CI
    if (!this.nuevoIngreso.nit || this.nuevoIngreso.nit === 0) {
      Swal.fire({
        title: 'Ingrese su CI',
        input: 'text',
        inputLabel: 'CI',
        inputPlaceholder: 'Ingrese su número de CI',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'El CI es obligatorio';
          }
          return null;
        }
      }).then(ciResult => {
        if (ciResult.isConfirmed) {
          const ci = ciResult.value.trim();
          this.processCarnetCI(ci);
        }
      });
    } else {
      // Si ya hay un CI, proceder directamente a verificar
      this.processCarnetCI(this.nuevoIngreso.nit.toString());
    }
  }
  processCarnetCI(ci: string) {
    this.empresaService.getEmpresa().subscribe(response => {
      const empresasArray = response.empresas ?? response;
      const existingEmpresa = empresasArray.find((emp: empresa) =>
        String(emp.nit || emp.EMP_NIT) === ci
      );
  
      if (existingEmpresa) {
        // Fill inputs with existing data silently
        this.nuevoIngreso.nit = Number(existingEmpresa.nit || existingEmpresa.EMP_NIT || 0);
        this.nuevoIngreso.proveedor = existingEmpresa.nombre || existingEmpresa.EMP_NOM;
        this.nuevoIngreso.cod_prove = existingEmpresa.codigo || existingEmpresa.EMP_COD;
        // No mostrar ningún mensaje cuando el CI ya existe
        console.log('CI existente encontrado y datos cargados automáticamente');
      } else {
        // Prompt for name to add new empresa
        Swal.fire({
          title: 'Ingrese su Nombre',
          input: 'text',
          inputLabel: 'Nombre',
          inputPlaceholder: 'Ingrese su nombre completo',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'El nombre es obligatorio';
            }
            return null;
          }
        }).then(nameResult => {
          if (nameResult.isConfirmed) {
            const nombre = nameResult.value.trim().toUpperCase();
  
            Swal.fire({
              title: 'CI no encontrado',
              text: 'El CI no existe. ¿Desea agregarlo?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Sí, agregar',
              cancelButtonText: 'No, cancelar'
            }).then(confirmResult => {
              if (confirmResult.isConfirmed) {
                const newEmpresa: empresa = {
                  id_empresa: 0,
                  codigo: '',
                  nombre: nombre,
                  nit: Number(ci),
                  baja: false,
                  EMP_NIT: ci,
                  EMP_NOM: nombre,
                  EMP_COD: '',
                  EMP_NPATRONAL: '',
                  TIPO: ''
                };
  
                this.empresaService.postEmpresa(newEmpresa).subscribe({
                  next: (response: any) => {
                    const createdEmpresa = response as empresa;
                    this.nuevoIngreso.cod_prove = createdEmpresa.codigo || createdEmpresa.EMP_COD;
                    this.nuevoIngreso.nit = Number(ci);
                    this.nuevoIngreso.proveedor = nombre;
                    Swal.fire('Proveedor agregado', 'El CI y nombre fueron agregados correctamente.', 'success');
                  },
                  error: (err) => {
                    console.error('Error agregando CI:', err);
                    Swal.fire('Error', 'No se pudo agregar el CI.', 'error');
                  }
                });
              }
            });
          }
        });
      }
    });
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

  onFileChangeRecibo(evt: any) {
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
  
    this.getNextNumRecibo().then(() => {
      const startingNumRecibo = this.nuevoIngreso.num_recibo || 1;
  
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
  
        // Validar encabezados
        const headers = data[0] || [];
        const expectedHeaders = ['Fecha', 'Nro. Comprob.', 'Descripción del Movimiento', 'Importe a Conciliar'];
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
  
        // Mapear datos y guardar directamente en la base de datos
        const saveObservables = data.slice(1).map((row: any[], index: number) => {
          const ingresoToSave = new ingresos();
  
          // Parse date from 'Fecha' column (row[0])
          if (row[0]) {
            if (typeof row[0] === 'number') {
              // Excel serial date to JS Date with timezone adjustment
              const excelDate = row[0];
              const utcDays = excelDate - 25569;
              const utcValue = utcDays * 86400 * 1000;
              const dateInfo = new Date(utcValue);
              const jsDate = new Date(dateInfo.getTime() + dateInfo.getTimezoneOffset() * 60000);
              ingresoToSave.fecha = jsDate;
            } else if (typeof row[0] === 'string') {
              const parts = row[0].split('/');
              if (parts.length === 3) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
                const year = parseInt(parts[2], 10);
                ingresoToSave.fecha = new Date(year, month, day);
              } else {
                ingresoToSave.fecha = new Date(row[0]);
              }
            } else if (row[0] instanceof Date) {
              ingresoToSave.fecha = row[0];
            } else {
              ingresoToSave.fecha = new Date(row[0]);
            }
          } else {
            const fechaStr = this.nuevoIngreso.fecha ?
              new Date(this.nuevoIngreso.fecha).toLocaleDateString('es-ES') : '';
            ingresoToSave.fecha = new Date(fechaStr);
          }
  
          ingresoToSave.num_depo = row[1] ?? '';
          ingresoToSave.detalle = row[2] ?? '';
  
          // Parse monto from 'Importe a Conciliar' column (row[3])
          let montoValue = row[3];
          if (typeof montoValue === 'string') {
            montoValue = montoValue.replace(',', '.');
          }
          ingresoToSave.monto = parseFloat(montoValue) || 0;
          ingresoToSave.importe_total = ingresoToSave.monto;
  
          // Assign incremented num_recibo starting from startingNumRecibo
          ingresoToSave.num_recibo = startingNumRecibo + index;
  
          // Set other required fields with defaults or from your component state
          ingresoToSave.estado = 'CONSOLIDADO';
          ingresoToSave.cerrado = 'SI';
          ingresoToSave.fecha_reg = new Date();
          ingresoToSave.cuenta = '1-45990921';
          ingresoToSave.tipo_emision = 'RECIBO';
          ingresoToSave.num_factura = 0;
          ingresoToSave.nit = 0;
  
          // You can set additional fields if needed here
  
          return this.ingresoService.postIngresos(ingresoToSave);
        });
        console.log('guardado de excel',this.nuevoIngreso);
        forkJoin(saveObservables).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Todos los registros fueron guardados correctamente.', 'success');
            this.goBack();
          },
          error: (err) => {
            Swal.fire('Error', 'Ocurrió un error al guardar los registros.', 'error');
            console.error(err);
          }
        });
      };
      reader.readAsBinaryString(file);
    });


    
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
    this.nuevoIngreso.num_form = 0;
    this.nuevoIngreso.nit = 0;


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
     // this.checkAndAddCarnetCI();
      // <-- Add this line to update detalle on rubro change
    } else {
      this.nuevoIngreso.id_tipo_rubro = '';
      this.nuevoIngreso.nombre = '';

    }
    console.log('recibo', this.nuevoIngreso.num_rubro);

  }

  getNextNumRecibo(): Promise<void> {
    return new Promise((resolve) => {
      this.ingresoService.getLastNumRecibo().subscribe({
        next: (lastNum: number) => {
          console.log('Raw last receipt number from backend:', lastNum);
          this.nuevoIngreso.num_recibo = (lastNum && lastNum > 0) ? lastNum + 1 : 1;
          console.log('Assigned next receipt number:', this.nuevoIngreso.num_recibo);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching last receipt number:', error);
          this.nuevoIngreso.num_recibo = 1; // fallback start from 1
          resolve();
        }
      });
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
      this.getNextNumRecibo();
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
  buscarAporte(num_form: number) {
    if (this.nuevoIngreso.tipo_emision !== 'RECIBO') {
      return;
    }

    this.ingresoService.getAportes(num_form).subscribe({
      next: (data: any) => {
        console.log('Full aporte data:', data);
        if (data && data.pagos && data.pagos.length > 0) {
          const aporte = data.pagos[0];
          this.nuevoIngreso.proveedor = aporte.EMPRESA || '';
          // Parse date string dd/mm/yyyy to Date object
          if (aporte.FECHA_PAGO) {
            const parts = aporte.FECHA_PAGO.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              this.nuevoIngreso.fecha = new Date(year, month, day);
            } else {
              this.nuevoIngreso.fecha = new Date(aporte.FECHA_PAGO);
            }
          } else {
            this.nuevoIngreso.fecha = new Date();
          }
          this.nuevoIngreso.monto = aporte.TOTAL_IMPORTE_PLANILLA || 0;
          this.nuevoIngreso.importe_total = aporte.TOTAL_IMPORTE_PLANILLA || 0;

          // Handle deposito_dema and op_deposito_dema flag
          // ... existing code ...
          if (aporte.MONTO_DEMASIA && aporte.MONTO_DEMASIA > 0) {
            this.nuevoIngreso.deposito_dema = aporte.MONTO_DEMASIA;
            this.showDemasia = true;  // Use showDemasia instead of op_deposito_dema
          } else {
            this.nuevoIngreso.deposito_dema = 0;
            this.showDemasia = false; // Use showDemasia instead of op_deposito_dema
          }
          // ... existing code ...

          // Recalculate importe_total
          //this.calculateCostoTotal();

          // Set tipo_ingres and id_tipo_ingr_id automatically if METODO_PAGO is "DEPOSITO O TRANSFERENCIA"

           // After setting proveedor, verify if it exists in getAllEmpresas
        this.empresaService.getAllEmpresas().subscribe({
          next: (empresasResponse: any) => {
            const empresasArray = empresasResponse.empresas || empresasResponse;
            const matchedEmpresa = empresasArray.find((emp: empresa) =>
              String(emp.EMP_NOM).toUpperCase() === String(this.nuevoIngreso.proveedor).toUpperCase()
            );
            if (matchedEmpresa) {
              this.nuevoIngreso.cod_prove = matchedEmpresa.EMP_COD;
              console.log('Provider matched in getAllEmpresas, cod_prove set:', matchedEmpresa.EMP_COD);
            } else {
              this.nuevoIngreso.cod_prove = '';
              console.log('Provider not found in getAllEmpresas');
            }
          },
          error: (err) => {
            console.error('Error fetching empresas in buscarAporte:', err);
          }
        });
          if (aporte.METODO_PAGO) {
            const metodoPagoUpper = aporte.METODO_PAGO.toUpperCase();
            switch (metodoPagoUpper) {
              case 'DEPOSITO O TRANSFERENCIA':
                const tipoIngresoMatchDeposito = this.tipoIngresos.find(ti => ti.tipo_ingr.toUpperCase() === 'DEPOSITO A LA CUENTA');
                if (tipoIngresoMatchDeposito) {
                  this.nuevoIngreso.tipo_ingres = tipoIngresoMatchDeposito.tipo_ingr;
                  this.nuevoIngreso.id_tipo_ingr_id = tipoIngresoMatchDeposito.id_tipo_ingr;
                } else {
                  this.nuevoIngreso.tipo_ingres = 'DEPOSITO A LA CUENTA';
                  this.nuevoIngreso.id_tipo_ingr_id = '';
                }
                break;
              case 'SIGEP':
                const tipoIngresoMatchSigep = this.tipoIngresos.find(ti => ti.tipo_ingr.toUpperCase() === 'TRASPASO TGN');
                if (tipoIngresoMatchSigep) {
                  this.nuevoIngreso.tipo_ingres = tipoIngresoMatchSigep.tipo_ingr;
                  this.nuevoIngreso.id_tipo_ingr_id = tipoIngresoMatchSigep.id_tipo_ingr;
                } else {
                  this.nuevoIngreso.tipo_ingres = 'TRASPASO TGN';
                  this.nuevoIngreso.id_tipo_ingr_id = '';
                }
                break;
            }
            if (aporte.TIPO_EMPRESA) {
              const metodoPagoUpper = aporte.TIPO_EMPRESA.toUpperCase();
              switch (metodoPagoUpper) {
                case 'AP':
                  const tipoEmpresaMatchAp = this.tipoRubros.find(r => r.servicio === 'APORTES PATRONALES Y APORTES (PUBLICO)');
                  if (tipoEmpresaMatchAp) {
                    this.nuevoIngreso.id_tipo_rubro = tipoEmpresaMatchAp.id_detalle_rubro;
                    this.nuevoIngreso.servicio = tipoEmpresaMatchAp.servicio;
                    this.nuevoIngreso.nombre = tipoEmpresaMatchAp.nombre;
                    this.nuevoIngreso.num_rubro = tipoEmpresaMatchAp.num_rubro;
                    this.updateDetalle();
                  } else {
                    // If no matching rubro found, clear or set defaults as needed
                    this.nuevoIngreso.id_tipo_rubro = '';
                    this.nuevoIngreso.servicio = '';
                    this.nuevoIngreso.nombre = '';
                    this.nuevoIngreso.num_rubro = '';
                  }
                  break;
                case 'AV':
                  const tipoEmpresaMatchAv = this.tipoRubros.find(r => r.servicio === 'APORTES PATRONALES Y APORTES (PRIVADO)');
                  if (tipoEmpresaMatchAv) {
                    this.nuevoIngreso.id_tipo_rubro = tipoEmpresaMatchAv.id_detalle_rubro;
                    this.nuevoIngreso.servicio = tipoEmpresaMatchAv.servicio;
                    this.nuevoIngreso.nombre = tipoEmpresaMatchAv.nombre;
                    this.nuevoIngreso.num_rubro = tipoEmpresaMatchAv.num_rubro;
                    this.updateDetalle();
                  } else {
                    // If no matching rubro found, clear or set defaults as needed
                    this.nuevoIngreso.id_tipo_rubro = '';
                    this.nuevoIngreso.servicio = '';
                    this.nuevoIngreso.nombre = '';
                    this.nuevoIngreso.num_rubro = '';
                  }
                  break;
              }
            }
          }


          // Show success Swal after loading data
          Swal.fire('Datos cargados', 'Los datos del aporte fueron cargados correctamente.', 'success');

        } else {
          Swal.fire('No encontrado', 'No se encontró aporte con ese número de formulario.', 'info');
        }
      },
      error: (error) => {
        console.error('Error al buscar aporte:', error);
        Swal.fire('Error', 'Ocurrió un error al buscar el aporte.', 'error');
      }
    });
  }
  // buscarAporte(num_form: number) {
  //   if (this.nuevoIngreso.tipo_emision !== 'RECIBO') {
  //     return;
  //   }
  
  //   this.ingresoService.getAportes(num_form).subscribe({
  //     next: (data: any) => {
  //       console.log('Full aporte data:', data);
  //       if (data && data.pagos && data.pagos.length > 0) {
  //         const aporte = data.pagos[0];
  //         this.nuevoIngreso.proveedor = aporte.EMPRESA || '';
  //         // Parse date string dd/mm/yyyy to Date object
  //         if (aporte.FECHA_PAGO) {
  //           const parts = aporte.FECHA_PAGO.split('/');
  //           if (parts.length === 3) {
  //             const day = parseInt(parts[0], 10);
  //             const month = parseInt(parts[1], 10) - 1;
  //             const year = parseInt(parts[2], 10);
  //             this.nuevoIngreso.fecha = new Date(year, month, day);
  //           } else {
  //             this.nuevoIngreso.fecha = new Date(aporte.FECHA_PAGO);
  //           }
  //         } else {
  //           this.nuevoIngreso.fecha = new Date();
  //         }
  //         this.nuevoIngreso.monto = aporte.TOTAL_IMPORTE_PLANILLA || 0;
  //         this.nuevoIngreso.importe_total = aporte.TOTAL_IMPORTE_PLANILLA || 0;
  
  //         if (aporte.MONTO_DEMASIA && aporte.MONTO_DEMASIA > 0) {
  //           this.nuevoIngreso.deposito_dema = aporte.MONTO_DEMASIA;
  //           this.showDemasia = true;
  //         } else {
  //           this.nuevoIngreso.deposito_dema = 0;
  //           this.showDemasia = false;
  //         }
  
  //         // After setting proveedor, verify if it exists in getAllEmpresas
  //         this.empresaService.getAllEmpresas().subscribe({
  //           next: (empresasResponse: any) => {
  //             const empresasArray = empresasResponse.empresas || empresasResponse;
  //             const matchedEmpresa = empresasArray.find((emp: empresa) =>
  //               String(emp.EMP_NOM).toUpperCase() === String(this.nuevoIngreso.proveedor).toUpperCase()
  //             );
  //             if (matchedEmpresa) {
  //               this.nuevoIngreso.cod_prove = matchedEmpresa.EMP_COD;
  //               console.log('Provider matched in getAllEmpresas, cod_prove set:', matchedEmpresa.EMP_COD);
  //             } else {
  //               this.nuevoIngreso.cod_prove = '';
  //               console.log('Provider not found in getAllEmpresas');
  //             }
  //           },
  //           error: (err) => {
  //             console.error('Error fetching empresas in buscarAporte:', err);
  //           }
  //         });
  
  //         // Existing logic for METODO_PAGO and TIPO_EMPRESA...
  
  //         Swal.fire('Datos cargados', 'Los datos del aporte fueron cargados correctamente.', 'success');
  
  //       } else {
  //         Swal.fire('No encontrado', 'No se encontró aporte con ese número de formulario.', 'info');
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error al buscar aporte:', error);
  //       Swal.fire('Error', 'Ocurrió un error al buscar el aporte.', 'error');
  //     }
  //   });
  // }
  isExcludedRubro(id_tipo_rubro: any): boolean {
    const serviciosExcluidos = [
      'VENTA DE CARNETS DE ASEGURADO',
      'FORMULARIOS DE NOVEDADES',
      'VENTA DE EXAMENES POST OCUPACIONALES',
      'VENTA DE EXAMENES PRE OCUPACIONALES',
      'MULTAS POR INCUMPLIMIENTOS A CONTRATOS',
      'RECAUDACION POR INTERNADO ROTATORIO',
      'VENTA DE BIDONES',
      'MULTAS POR BAJA DEL ASEGURADO',


    ];

    const rubro = this.tipoRubros.find(r => r.id_detalle_rubro === id_tipo_rubro);
    if (!rubro) {
      return false;
    }
    return serviciosExcluidos.includes(rubro.servicio);
  }
  isVentaDeCarnets(id_tipo_rubro: any): boolean {
    const rubro = this.tipoRubros.find(r => r.id_detalle_rubro === id_tipo_rubro);
    return rubro?.servicio === 'VENTA DE CARNETS DE ASEGURADO';
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
          this.getNextNumRecibo();  // Esperar a que se obtenga y asigne el número
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
