import { Component, OnInit, ViewChild } from '@angular/core';
import { ingresos } from '../../../models/ingresos';
import { FormGroup } from '@angular/forms';
import { IngresosService } from '../../../service/ingresos.service';
import { Router } from '@angular/router';
import { empresa } from '../../../models/empresa';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-reg-ingresos',
  standalone: false,
  templateUrl: './reg-ingresos.component.html',
  styleUrl: './reg-ingresos.component.css'
})
export class RegIngresosComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  dtOptions: any = {};
  public loading: boolean = true;
  detalleFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  isLoadingUpdate = false;

  titulosColumnas = [
    'NRO.',
    //'NRO. FACTURA',
    'LUGAR',
    'FECHA DE REGISTRO',
    'T. DE INGRESO',
    'PROVEEDOR',
    'DETALLE',
    'IMPORTE TOTAL',
    //'ESTADO',
    //'CERRADO',
    //'FECHA DE REGISTRO',
    'ACCION'
  ];


  ingreso: any[] = []
  ingresos = new ingresos
  activeTab: any;
  
  // Document type filtering
  selectedDocumentType: string = 'TODOS';
  filteredIngresos: any[] = [];
  documentTypes = [
    { value: 'TODOS', label: 'TODOS', icon: 'fa-list' },
    { value: 'FACTURA', label: 'FACTURA', icon: 'fa-file-invoice' },
    { value: 'RECIBO', label: 'RECIBO', icon: 'fa-receipt' },
    { value: 'DOCUMENTO', label: 'DOCUMENTO', icon: 'fa-file-alt' }
  ];

  // Search functionality
  searchTerm: string = '';
  searchFields = ['num_recibo', 'num_factura', 'lugar', 'proveedor', 'detalle'];

  // Pagination (5 per page)
  pageSize: number = 5;
  currentPageFacturas: number = 1;
  currentPageRecibos: number = 1;
  currentPageDocumentos: number = 1;


  constructor(
    private router: Router,
    private ingresosServive: IngresosService
  ) { }

  ngOnInit(): void {
    //const todayString = new Date().toISOString().split('T')[0];
    //const disabledDate = localStorage.getItem('disableNuevoRegistroForToday');
   // this.disableNuevoRegistroForToday = disabledDate === todayString;
    this.dtOptions = {
      responsive: true,
      order: [[1, 'desc']],
      columnDefs: [{
        width: "170px",
        targets: 0
      },
      {
        width: "170px",
        targets: 1
      },
      {
        width: "180px",
        targets: 2
      },
      {
        width: "170px",
        targets: 3
      },
      {
        width: "190px",
        targets: 4
      },
      {
        width: "300px",
        targets: 5
      },
      {
        width: "200px",
        targets: 6
      },
      {
        width: "190px",
        targets: 7
      },
      // {
      //   width: "120px",
      //   targets: 8
      // },
      // {
      //   width: "100px",
      //   targets: 9
      // },
      // {
      //   width: "200px",
      //   targets: 10
      // },
      // {
      //   width: "200px",
      //   targets: 11
      // }


      ],

      language: {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrar _MENU_ Entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar:",
        "zeroRecords": "Sin resultados encontrados",
        "paginate": {
          "first": "Primero",
          "last": "Ultimo",
          "next": "Siguiente",
          "previous": "Anterior"
        }
      }
    };
    this.cargar_tabla();

  }

  // generateDailyReport() {
  //   const today = new Date();
  //   const todayString = today.toISOString().split('T')[0]; // yyyy-mm-dd
  //
  //   const ingresosHoy = this.ingreso.filter(item => {
  //     const fechaIngreso = new Date(item.fecha);
  //     const fechaString = fechaIngreso.toISOString().split('T')[0];
  //     return fechaString === todayString && item.estado === 'CONSOLIDADO' && item.cerrado === 'SI';
  //   });
  //
  //   if (ingresosHoy.length === 0) {
  //     Swal.fire('Reporte no generado', 'No hay registros consolidados y cerrados para el día de hoy.', 'info');
  //     return;
  //   }
  //
  //   this.ingresosServive.getReporteDiario(todayString).subscribe({
  //
  //     next: (blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `reporte_ingresosDiarios_${todayString}.pdf`;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //
  //       Swal.fire('Reporte generado', `Se generó el reporte con ${ingresosHoy.length} registros consolidados y cerrados.`, 'success');
  //
  //       this.disableNuevoRegistroForToday = true;
  //       localStorage.setItem('disableNuevoRegistroForToday', todayString);
  //     },
  //     error: (err) => {
  //       console.error('Error generating report:', err);
  //       Swal.fire('Error', 'No se pudo generar el reporte. Intente nuevamente.', 'error');
  //     }
  //   });
  // }
  disableNuevoRegistroForToday: boolean = false;
  // Add this property to the component class:
  // reg-ingresos.component.ts

  editarRegistro(ingresos: ingresos) {

    this.router.navigateByUrl(`/ingresos/reg-ingresos/edit/${ingresos}`);
  }

  public cargar_tabla() {
    this.loading = true;
    this.ingreso = []
    this.ingresosServive.getIngresos().subscribe(
      ingr => {
        this.ingreso = ingr
        this.filterByDocumentType();
        this.loading = false;
      },
      error => {
        console.error('Error cargando datos:', error);
        this.loading = false;
      });  
  }

  // Filter by document type
  filterByDocumentType() {
    if (this.selectedDocumentType === 'TODOS') {
      this.filteredIngresos = this.ingreso.filter(item => item.baja !== true);
    } else {
      this.filteredIngresos = this.ingreso.filter(item => 
        item.baja !== true && (item.tipo_ingres === this.selectedDocumentType || item.tipo_emision === this.selectedDocumentType)
      );
    }
  }

  // Change document type filter
  onDocumentTypeChange(documentType: string) {
    this.selectedDocumentType = documentType;
    this.filterByDocumentType();
    this.currentPageFacturas = 1;
    this.currentPageRecibos = 1;
    this.currentPageDocumentos = 1;
  }

  // Get count of documents by type
  getDocumentCount(documentType: string): number {
    if (documentType === 'TODOS') {
      return this.ingreso.filter(item => item.baja !== true).length;
    }
    return this.ingreso.filter(item => 
      item.baja !== true && (item.tipo_ingres === documentType || item.tipo_emision === documentType)
    ).length;
  }

  // Get specific document types with search
  getFacturas(): any[] {
    let facturas = this.ingreso.filter(item => 
      item.baja !== true && (item.tipo_ingres === 'FACTURA' || item.tipo_emision === 'FACTURA')
    );

    if (this.searchTerm.trim()) {
      facturas = this.applySearch(facturas);
    }
    facturas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    return facturas;
  }

  getRecibos(): any[] {
    let recibos = this.ingreso.filter(item => 
      item.baja !== true && (item.tipo_ingres === 'RECIBO' || item.tipo_emision === 'RECIBO')
    );
    
    if (this.searchTerm.trim()) {
      recibos = this.applySearch(recibos);
    }
    recibos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return recibos;
  }

  getDocumentos(): any[] {
    let documentos = this.ingreso.filter(item => 
      item.baja !== true && (item.tipo_ingres === 'DOCUMENTO' || item.tipo_emision === 'DOCUMENTO')
    );
    
    if (this.searchTerm.trim()) {
      documentos = this.applySearch(documentos);
    }
    documentos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    return documentos;
  }

  // Apply search filter
  applySearch(items: any[]): any[] {
    if (!this.searchTerm.trim()) {
      return items;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    return items.filter(item => {
      return this.searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchLower);
      });
    });
  }

  // Clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.currentPageFacturas = 1;
    this.currentPageRecibos = 1;
    this.currentPageDocumentos = 1;
  }

  // Handle search input change
  onSearchChange(): void {
    // The search is applied automatically through the getter methods
    // This method can be used for additional logic if needed
    this.currentPageFacturas = 1;
    this.currentPageRecibos = 1;
    this.currentPageDocumentos = 1;
  }

  // Get unique types for debug
  getUniqueTypes(): string[] {
    const tiposIngres = this.ingreso
      .filter(item => item.baja !== true)
      .map(item => item.tipo_ingres)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    const tiposEmision = this.ingreso
      .filter(item => item.baja !== true)
      .map(item => item.tipo_emision)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    const todosLosTipos = [...tiposIngres, ...tiposEmision].filter((value, index, self) => self.indexOf(value) === index);
    return todosLosTipos;
  }

  // Get active records count
  getActiveRecordsCount(): number {
    return this.ingreso.filter(item => item.baja !== true).length;
  }

  // Pagination helpers
  private paginate(items: any[], page: number): any[] {
    const start = (page - 1) * this.pageSize;
    return items.slice(start, start + this.pageSize);
  }

  private getTotalPages(totalItems: number): number {
    return Math.max(1, Math.ceil(totalItems / this.pageSize));
  }

  getFacturasPage(): any[] { return this.paginate(this.getFacturas(), this.currentPageFacturas); }
  getFacturasTotalPages(): number { return this.getTotalPages(this.getFacturas().length); }
  getFacturasStartIndex(): number { const total = this.getFacturas().length; return total === 0 ? 0 : (this.currentPageFacturas - 1) * this.pageSize + 1; }
  getFacturasEndIndex(): number { return Math.min(this.currentPageFacturas * this.pageSize, this.getFacturas().length); }
  nextFacturasPage(): void { if (this.currentPageFacturas < this.getFacturasTotalPages()) { this.currentPageFacturas++; } }
  prevFacturasPage(): void { if (this.currentPageFacturas > 1) { this.currentPageFacturas--; } }
  firstFacturasPage(): void { this.currentPageFacturas = 1; }
  lastFacturasPage(): void { this.currentPageFacturas = this.getFacturasTotalPages(); }




  getRecibosPage(): any[] { return this.paginate(this.getRecibos(), this.currentPageRecibos); }
  getRecibosTotalPages(): number { return this.getTotalPages(this.getRecibos().length); }
  getRecibosStartIndex(): number { const total = this.getRecibos().length; return total === 0 ? 0 : (this.currentPageRecibos - 1) * this.pageSize + 1; }
  getRecibosEndIndex(): number { return Math.min(this.currentPageRecibos * this.pageSize, this.getRecibos().length); }
  nextRecibosPage(): void { if (this.currentPageRecibos < this.getRecibosTotalPages()) { this.currentPageRecibos++; } }
  prevRecibosPage(): void { if (this.currentPageRecibos > 1) { this.currentPageRecibos--; } }
  firstRecibosPage(): void { this.currentPageRecibos = 1; }
  lastRecibosPage(): void { this.currentPageRecibos = this.getRecibosTotalPages(); }
  

  getDocumentosPage(): any[] { return this.paginate(this.getDocumentos(), this.currentPageDocumentos); }
  getDocumentosTotalPages(): number { return this.getTotalPages(this.getDocumentos().length); }
  getDocumentosStartIndex(): number { const total = this.getDocumentos().length; return total === 0 ? 0 : (this.currentPageDocumentos - 1) * this.pageSize + 1; }
  getDocumentosEndIndex(): number { return Math.min(this.currentPageDocumentos * this.pageSize, this.getDocumentos().length); }
  nextDocumentosPage(): void { if (this.currentPageDocumentos < this.getDocumentosTotalPages()) { this.currentPageDocumentos++; } }
  prevDocumentosPage(): void { if (this.currentPageDocumentos > 1) { this.currentPageDocumentos--; } }
  firstDocumentosPage(): void { this.currentPageDocumentos = 1; }
  lastDocumentosPage(): void { this.currentPageDocumentos = this.getDocumentosTotalPages(); }

  
  eliminarRegistro(id_ingresos: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡Esta acción marcará el registro como inactivo y no se podrá recuperar fácilmente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.ingresosServive.deleteIngresos(id_ingresos).subscribe({
          next: () => {
            this.isLoading = false;
            this.ingresos.baja = false
            Swal.fire('¡Eliminado!', 'El registro ha sido dado de baja.', 'success');
            this.cargar_tabla();
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading = false;
            console.error('Error al dar de baja el registro:', error);
            if (error.status === 404) {
              Swal.fire('No Encontrado', error.error?.message || 'El registro no fue encontrado o ya estaba dado de baja.', 'error');
            } else if (error.status === 400) { // Add this if you suspect validation errors for the ID
              Swal.fire('Error de Petición', error.error?.message || 'La solicitud no es válida. Verifique el ID.', 'error');
            }
            else {
              Swal.fire('Error', 'No se pudo dar de baja el registro. Por favor, intente de nuevo.', 'error');
            }
          }
        });
      }
    });
  }
  
  emitirRecibo(id_ingresos: number) {
    Swal.fire({
      title: '¿Qué desea hacer?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Descargar',
      denyButtonText: 'Vista previa',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed || result.isDenied) {
        this.loading = true;
        this.ingresosServive.getReporteRecibo(id_ingresos).subscribe({
          next: (response) => {
            this.loading = false;
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
  
            if (result.isConfirmed) {
              const a = document.createElement('a');
              a.href = url;
              a.download = `Recibo_${id_ingresos}.pdf`;
              a.click();
              window.URL.revokeObjectURL(url);
            } else if (result.isDenied) {
              window.open(url, '_blank');
            }
          },
          error: (err) => {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo generar el recibo. Intente nuevamente.'
            });
          }
        });
      }
    });
  }
  
}