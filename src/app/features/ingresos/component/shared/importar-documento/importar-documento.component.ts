import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ingresos } from '../../../../models/ingresos'; 
import { IngresosService } from '../../../../service/ingresos.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-importar-documento',
  standalone: false,
  templateUrl: './importar-documento.component.html',
  styleUrl: './importar-documento.component.css'
})
export class ImportarDocumentoComponent implements OnInit{
public loading: boolean=false;
public ingresos: ingresos[] = [];
public ingreso = new ingresos();
@Input() excelPreview: any[] = [];
@Input() excelFileToImport: File | null = null;
pagedExcelPreview: any[] = []; // Añade esta variable para los datos paginados
pageSize = 10; // Number of rows per page
currentPage = 1;
totalPages = 1;
@Output() closeModal = new EventEmitter();
@Output() messageEvent = new EventEmitter<ingresos>();
titulosColumnas = [
  'NRO. DEPOSITO',
  'DESCRIPCION',
  'IMPORTE TOTAL',
  'OPERACION'
];
dtOptions: any = {};
constructor(private ingresosService: IngresosService) { }
  ngOnInit(): void {this.dtOptions = {
    responsive: true,
    order: [[0, 'desc']],
    columnDefs: [{
      width: "500px",
      targets: 0
    },
    {
      width: "500px",
      targets: 1
    },
    {
      width: "500px",
      targets: 2
    },
    {
      width: "500px",
      targets: 3
    }

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

}
ngOnChanges(changes: SimpleChanges) {
  if (changes['excelPreview'] && this.excelPreview && this.excelPreview.length > 0) {
    this.onExcelPreviewLoaded();
  }
}
updatePagedData() {
  this.totalPages = Math.ceil(this.excelPreview.length / this.pageSize);
  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
  }
  if (this.currentPage < 1) {
    this.currentPage = 1;
  }
  const startIndex = (this.currentPage - 1) * this.pageSize;
  this.pagedExcelPreview = this.excelPreview.slice(startIndex, startIndex + this.pageSize);
}

goToFirstPage() {
  this.currentPage = 1;
  this.updatePagedData();
}

goToPreviousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePagedData();
  }
}

goToNextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updatePagedData();
  }
}

goToLastPage() {
  this.currentPage = this.totalPages;
  this.updatePagedData();
}

onExcelPreviewLoaded() {
  this.currentPage = 1;
  this.updatePagedData();
}

onCloseModal(): void {
  this.closeModal.emit();
  this.messageEvent.emit(this.ingreso);
   // Reset modal state and data
   this.excelFileToImport = null;
   this.excelPreview = [];
   this.pagedExcelPreview = [];
   this.currentPage = 1;
   this.totalPages = 1;
}
guardarRegistro() {
  if (!this.excelFileToImport) {
    Swal.fire('Error', 'No hay archivo para importar.', 'error');
    return;
  }
  const formData = new FormData();
  formData.append('file', this.excelFileToImport);

  this.ingresosService.importDocumentos(formData).subscribe(
    (response: any) => {
      Swal.fire('Mensaje Informativo', response.message || 'Empresas importadas correctamente.', 'success');
      this.onCloseModal();
      this.excelPreview = [];
      this.excelFileToImport = null;
    }
  );
}

}