import { Component, OnInit, ViewChild } from '@angular/core';
import { empresa } from '../../../models/empresa';
import { FormGroup } from '@angular/forms';
import { EmpresaService } from '../../../service/empresa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-empresas',
  standalone: false,
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.css'
})
export class EmpresasComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  dtOptions: any = {};
  public loading: boolean = true;
  detalleFormGroup!: FormGroup;
  submitted = false;
  isLoading = false;
  button = 'Guardar';
  isLoadingUpdate = false;
  empresasExcelPreview: any[] = [];
  excelFileToImport: File | null = null;

  titulosColumnas = [
    'NOMBRE',
    'NIT',
    'ACCION'
  ];

  empresa: any[] = []
  empresas = new empresa
  lista: any;
  selectedItem: any;

  setSelectedItem(item: any) {
    this.selectedItem = item;
  }
  setModalProveedor() {
    this.selectedItem = 2;
  }

  receiveMessageImportData($event: empresa) {
    this.cargar_tabla();
  }

  constructor(
    private router: Router,
    private empresasService: EmpresaService) {
  }


  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      order: [[1, 'desc']],
      columnDefs: [{
        width: "800px",
        targets: 0
      },
      {
        width: "800px",
        targets: 1
      },
      {
        width: "200px",
        targets: 2
      }
        ,

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

  public cargar_tabla() {
    this.loading = true;
    this.empresa = []
    this.empresasService.getEmpresa().subscribe(
      emp => {
        this.empresa = emp
        this.loading = false;
      });


  }

 // obtenerProveedores() {
  //   this.loading = true;
  //   this.empresaService.getEmpresa()
  //     .subscribe((res: any) => {
  //       this.proveedores = res
  //       this.loading = false;
  //     });
     
  // }
  editarRegistro(empresa: empresa) {

    this.router.navigateByUrl(`/ingresos/empresas/edit/${empresa}`);
  }
  eliminarRegistro(id_empresa: number): void {
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
        this.empresasService.deleteEmpresas(id_empresa).subscribe({
          next: () => {
            this.isLoading = false;
            this.empresas.baja = false
            Swal.fire('¡Eliminado!', 'El registro ha sido dado de baja.', 'success');
            this.cargar_tabla();
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading = false;
            console.error('Error al dar de baja el registro:', error);
            if (error.status === 404) {
              Swal.fire('No Encontrado', error.error?.message || 'El registro no fue encontrado o ya estaba dado de baja.', 'error');
            } else if (error.status === 400) {
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
      const expectedHeaders = ['CODIGO', 'NOMBRE', 'TIPO', 'DIRECCION', 'TELEFONO'];
      const headersValid = expectedHeaders.every((h, i) => (headers[i] || '').toString().trim().toUpperCase() === h);

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
      this.empresasExcelPreview = data.slice(1).map((row: any[]) => ({
        codigo: row[0] ?? '',
        nombre: row[1] ?? '',
        tipo: (row[2] ?? '').toString().trim().toUpperCase(),
        direccion: row[3] ?? '',
        telefono: row[4] ?? ''
      }));

      // Validar que todos los campos requeridos estén presentes en cada fila
      const datosValidos = this.empresasExcelPreview.every(emp =>
        emp.codigo && emp.nombre && emp.tipo && emp.direccion && emp.telefono
      );
      if (!datosValidos) {
        Swal.fire('Error', 'Todos los campos son obligatorios en cada fila.', 'error');
        return;
      }

      // Mostrar el modal de importación
      this.selectedItem = 2;
    };
    reader.readAsBinaryString(file);
  }

}
