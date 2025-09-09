import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { empresa } from '../../../../models/empresa';
import { EmpresaService } from '../../../../service/empresa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-import-data',
  standalone: false,
  templateUrl: './import-data.component.html',
  styleUrl: './import-data.component.css'
})
export class ImportDataComponent implements OnInit {

  public loading: boolean = false;
  public proveedores: empresa[] = [];
  public proveedor = new empresa;
  @Input() excelPreview: any[] = [];
  @Input() excelFileToImport: File | null = null;
  @Output() closeModal = new EventEmitter();
  @Output() messageEvent = new EventEmitter<empresa>();
  titulosColumnas = [
    'CODIGO',
    'NOMBRE',
    'TIPO',
    'DIRECCION',
    'TELEFONO',
    'OPERACION'
  ];
  dtOptions: any = {};

  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.dtOptions = {
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
      },
      {
        width: "500px",
        targets: 4
      },
      {
        width: "200px",
        targets: 5
      },

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
  onCloseModal(): void {
    this.closeModal.emit();
    this.messageEvent.emit(this.proveedor)
  }
  guardarRegistro() {
    if (!this.excelFileToImport) {
      Swal.fire('Error', 'No hay archivo para importar.', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.excelFileToImport);

    this.empresaService.importEmpresas(formData).subscribe(
      (response: any) => {
        Swal.fire('Mensaje Informativo', response.message || 'Empresas importadas correctamente.', 'success');
        this.onCloseModal();
        this.excelPreview = [];
        this.excelFileToImport = null;
      }
    );
  }

}
