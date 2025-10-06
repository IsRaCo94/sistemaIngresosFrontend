import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ingresos } from '../../../../models/ingresos';
import { IngresosService } from '../../../../service/ingresos.service';
import { empresa } from '../../../../models/empresa';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoIngreso } from '../../../../models/TipoIngreso';
import { RubrosDetalle } from '../../../../models/rubrosDetalle';
import { DetalleRubrosService } from '../../../../service/detalle-rubros.service';
import { persona } from '../../../../models/persona';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';
import { EmpresaService } from '../../../../service/empresa.service';

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
  pdfSrc: string | null = null;  // Agrega esta propiedad
  isEditing: boolean = true; // Set to true when editing

  
  constructor(
    private _formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private ingresoService: IngresosService,
    private _location: Location,
    private rutaActiva: ActivatedRoute,
    private tipoingresoService: IngresosService,
    private rubrosService: DetalleRubrosService,
    private empresaService: EmpresaService,
  
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
    this.onOpTipoEmisionChange(this.actualizarIngreso.op_tipoemision);
    this.getNextNumRecibo();
    //this.calculateCostoTotal2();

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
  getNextNumRecibo(): Promise<void> {
    return new Promise((resolve) => {
      this.ingresoService.getLastNumRecibo().subscribe({
        next: (lastNum: number) => {
          console.log('Raw last receipt number from backend:', lastNum);
          this.actualizarIngreso.num_recibo = (lastNum && lastNum > 0) ? lastNum + 1 : 1;
          console.log('Assigned next receipt number:', this.actualizarIngreso.num_recibo);
          resolve();
        },
        error: (error) => {
          console.error('Error fetching last receipt number:', error);
          this.actualizarIngreso.num_recibo = 1; // fallback start from 1
          resolve();
        }
      });
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
      this.pdfSrc = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append('file', file);
      this.ingresoService.extractPdfData(formData).subscribe((data: any) => {
        console.log('Datos recibidos del PDF:', data);
        if (this.actualizarIngreso.tipo_emision === 'FACTURA') {
          this.actualizarIngreso.proveedor = data.proveedor;
          const prefix = 'PRECIO Unidad (Servicios) ';
          let detalle = data.detalle || '';
          if (detalle.startsWith(prefix)) {
            detalle = detalle.substring(prefix.length);
          }
          this.actualizarIngreso.detalle = detalle;
          this.actualizarIngreso.monto = data.monto;
          this.actualizarIngreso.num_factura = data.num_factura;
          this.actualizarIngreso.nit = data.nit;
          const fechaISO = data.fecha;
          const fechaLocal = new Date(fechaISO);
          const fechaCorregida = new Date(fechaLocal.getTime() + fechaLocal.getTimezoneOffset() * 60000);
          this.actualizarIngreso.fecha = fechaCorregida;
          this.calculateCostoTotal2();

          this.empresaService.getAllEmpresas().subscribe(response => {
            const empresasArray = response.empresas;
            const matchedEmpresa = empresasArray.find((emp: empresa) =>
              String(emp.EMP_NIT) === String(this.actualizarIngreso.nit)
            );
            if (matchedEmpresa) {
              this.actualizarIngreso.cod_prove = matchedEmpresa.EMP_COD;
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
                  String(emp.EMP_NIT || emp.nit) === String(this.actualizarIngreso.nit)
                );

                if (matchedEmpresa2) {
                  this.actualizarIngreso.cod_prove = matchedEmpresa2.EMP_COD || matchedEmpresa2.codigo;
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
                        nombre: this.actualizarIngreso.proveedor,
                        nit: this.actualizarIngreso.nit,
                        baja: false,
                        EMP_NIT: String(this.actualizarIngreso.nit),
                        EMP_NOM: this.actualizarIngreso.proveedor,
                        EMP_COD: '',
                        EMP_NPATRONAL: '',
                        TIPO: ''
                      };

                      this.empresaService.getEmpresa().subscribe(empresas => {
                        const empresasArray3 = empresas.empresas || empresas;
                        const exists = empresasArray3.some((emp: empresa) =>
                          String(emp.EMP_NIT || emp.nit) === String(this.actualizarIngreso.nit)
                        );
                        if (exists) {
                          Swal.fire('Información', 'El proveedor ya existe en la base de datos.', 'info');
                        } else {
                          this.empresaService.postEmpresa(newEmpresa).subscribe({
                            next: (response: any) => {
                              const createdEmpresa = response as empresa;
                              this.actualizarIngreso.cod_prove = createdEmpresa.codigo || createdEmpresa.EMP_COD;
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
    console.log('verifyNit llamado, nit:', this.actualizarIngreso.nit, 'proveedor:', this.actualizarIngreso.proveedor);
    if (!this.actualizarIngreso.nit && !this.actualizarIngreso.proveedor) {
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
          this.actualizarIngreso.nit && String(emp.EMP_NIT ?? emp.nit) === String(this.actualizarIngreso.nit)
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
    if (this.actualizarIngreso.servicio !== 'VENTA DE CARNETS DE ASEGURADO') {
      return;
    }

    // Si el campo CI está vacío (0 o null/undefined), mostrar Swal para ingresar CI
    if (!this.actualizarIngreso.nit || this.actualizarIngreso.nit === 0) {
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
      this.processCarnetCI(this.actualizarIngreso.nit.toString());
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
        this.actualizarIngreso.nit = Number(existingEmpresa.nit || existingEmpresa.EMP_NIT || 0);
        this.actualizarIngreso.proveedor = existingEmpresa.nombre || existingEmpresa.EMP_NOM;
        this.actualizarIngreso.cod_prove = existingEmpresa.codigo || existingEmpresa.EMP_COD;
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
                    this.actualizarIngreso.cod_prove = createdEmpresa.codigo || createdEmpresa.EMP_COD;
                    this.actualizarIngreso.nit = Number(ci);
                    this.actualizarIngreso.proveedor = nombre;
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
  buscarAporte(num_form: number) {
    if (this.actualizarIngreso.tipo_emision !== 'RECIBO') {
      return;
    }

    this.ingresoService.getAportes(num_form).subscribe({
      next: (data: any) => {
        console.log('Full aporte data:', data);
        if (data && data.pagos && data.pagos.length > 0) {
          const aporte = data.pagos[0];
          this.actualizarIngreso.proveedor = aporte.EMPRESA || '';
          // Parse date string dd/mm/yyyy to Date object
          if (aporte.FECHA_PAGO) {
            const parts = aporte.FECHA_PAGO.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              this.actualizarIngreso.fecha = new Date(year, month, day);
            } else {
              this.actualizarIngreso.fecha = new Date(aporte.FECHA_PAGO);
            }
          } else {
            this.actualizarIngreso.fecha = new Date();
          }
          this.actualizarIngreso.monto = aporte.TOTAL_IMPORTE_PLANILLA || 0;
          this.actualizarIngreso.importe_total = aporte.TOTAL_IMPORTE_PLANILLA || 0;

          // Handle deposito_dema and op_deposito_dema flag
          // ... existing code ...
          if (aporte.MONTO_DEMASIA && aporte.MONTO_DEMASIA > 0) {
            this.actualizarIngreso.deposito_dema = aporte.MONTO_DEMASIA;
            this.showDemasia = true;  // Use showDemasia instead of op_deposito_dema
          } else {
            this.actualizarIngreso.deposito_dema = 0;
            this.showDemasia = false; // Use showDemasia instead of op_deposito_dema
          }
          // ... existing code ...

          // Recalculate importe_total
          //this.calculateCostoTotal();

          // Set tipo_ingres and id_tipo_ingr_id automatically if METODO_PAGO is "DEPOSITO O TRANSFERENCIA"
          if (aporte.METODO_PAGO) {
            const metodoPagoUpper = aporte.METODO_PAGO.toUpperCase();
            switch (metodoPagoUpper) {
              case 'DEPOSITO O TRANSFERENCIA':
                const tipoIngresoMatchDeposito = this.tipoIngresos.find(ti => ti.tipo_ingr.toUpperCase() === 'DEPOSITO A LA CUENTA');
                if (tipoIngresoMatchDeposito) {
                  this.actualizarIngreso.tipo_ingres = tipoIngresoMatchDeposito.tipo_ingr;
                  this.actualizarIngreso.id_tipo_ingr_id = tipoIngresoMatchDeposito.id_tipo_ingr;
                } else {
                  this.actualizarIngreso.tipo_ingres = 'DEPOSITO A LA CUENTA';
                  this.actualizarIngreso.id_tipo_ingr_id = '';
                }
                break;
              case 'SIGEP':
                const tipoIngresoMatchSigep = this.tipoIngresos.find(ti => ti.tipo_ingr.toUpperCase() === 'TRASPASO TGN');
                if (tipoIngresoMatchSigep) {
                  this.actualizarIngreso.tipo_ingres = tipoIngresoMatchSigep.tipo_ingr;
                  this.actualizarIngreso.id_tipo_ingr_id = tipoIngresoMatchSigep.id_tipo_ingr;
                } else {
                  this.actualizarIngreso.tipo_ingres = 'TRASPASO TGN';
                  this.actualizarIngreso.id_tipo_ingr_id = '';
                }
                break;
            }
            if (aporte.TIPO_EMPRESA) {
              const metodoPagoUpper = aporte.TIPO_EMPRESA.toUpperCase();
              switch (metodoPagoUpper) {
                case 'AP':
                  const tipoEmpresaMatchAp = this.tipoRubros.find(r => r.servicio === 'APORTES PATRONALES Y APORTES (PUBLICO)');
                  if (tipoEmpresaMatchAp) {
                    this.actualizarIngreso.id_tipo_rubro = tipoEmpresaMatchAp.id_detalle_rubro;
                    this.actualizarIngreso.servicio = tipoEmpresaMatchAp.servicio;
                    this.actualizarIngreso.nombre = tipoEmpresaMatchAp.nombre;
                    this.actualizarIngreso.num_rubro = tipoEmpresaMatchAp.num_rubro;
                    this.updateDetalle();
                  } else {
                    // If no matching rubro found, clear or set defaults as needed
                    this.actualizarIngreso.id_tipo_rubro = '';
                    this.actualizarIngreso.servicio = '';
                    this.actualizarIngreso.nombre = '';
                    this.actualizarIngreso.num_rubro = '';
                  }
                  break;
                case 'AV':
                  const tipoEmpresaMatchAv = this.tipoRubros.find(r => r.servicio === 'APORTES PATRONALES Y APORTES (PRIVADO)');
                  if (tipoEmpresaMatchAv) {
                    this.actualizarIngreso.id_tipo_rubro = tipoEmpresaMatchAv.id_detalle_rubro;
                    this.actualizarIngreso.servicio = tipoEmpresaMatchAv.servicio;
                    this.actualizarIngreso.nombre = tipoEmpresaMatchAv.nombre;
                    this.actualizarIngreso.num_rubro = tipoEmpresaMatchAv.num_rubro;
                    this.updateDetalle();
                  } else {
                    // If no matching rubro found, clear or set defaults as needed
                    this.actualizarIngreso.id_tipo_rubro = '';
                    this.actualizarIngreso.servicio = '';
                    this.actualizarIngreso.nombre = '';
                    this.actualizarIngreso.num_rubro = '';
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
      const startingNumRecibo = this.actualizarIngreso.num_recibo || 1;
  
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
            if (typeof row[0] === 'string') {
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
            const fechaStr = this.actualizarIngreso.fecha ?
            new Date(this.actualizarIngreso.fecha).toLocaleDateString('es-ES') : '';
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

  // Apply search filter

}