import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { empresa } from '../../../../models/empresa';
import { EmpresaService } from '../../../../service/empresa.service';

@Component({
  selector: 'app-proveedor',
  standalone: false,
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css'
})
export class ProveedorComponent implements OnInit {
  public loading: boolean = false;
  public proveedores: empresa[] = [];
  public proveedor = new empresa;
  @Output() closeModal = new EventEmitter();
  @Output() messageEvent = new EventEmitter<empresa>();
  titulosColumnas = [
    'CODIGO',
    'NOMBRE',
    'NIT',
    'TIPO DE EMPRESA',
    'OPERACION'
  ];
  dtOptions: any = {};
  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      order: [[0, 'desc']],
      columnDefs: [{
        width: "100px",
        targets: 0
      },
      {
        width: "500px",
        targets: 1
      },
      {
        width: "300px",
        targets: 2
      },
      {
        width: "200px",
        targets: 3
      },
  
      {
        width: "200px",
        targets: 4
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
    this.obtenerProveedores()
  }
  onCloseModal(): void {
    this.closeModal.emit();
    this.messageEvent.emit(this.proveedor)
  }
  setProveedor(value: any) {
    this.proveedor = value;
    this.onCloseModal();
  }
  // obtenerProveedores() {
  //   this.loading = true;
  //   this.empresaService.getEmpresa()
  //     .subscribe((res: any) => {
  //       this.proveedores = res
  //       this.loading = false;
  //     });
     
  // }
  obtenerProveedores() {
  this.loading = true;
  this.empresaService.getAllEmpresas()
    .subscribe((res: any) => {
      this.proveedores = res.empresas as empresa[];  // <-- typed assignment here
      this.loading = false;
    });
}
    
}
