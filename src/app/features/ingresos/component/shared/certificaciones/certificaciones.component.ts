import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { empresa } from '../../../../models/empresa';
import { EmpresaService } from '../../../../service/empresa.service';
import { Certificacion } from '../../../../models/certificacion';
import { CertificacionService } from '../../../../service/certificacion.service';

@Component({
  selector: 'app-certificaciones',
  standalone: false,
  templateUrl: './certificaciones.component.html',
  styleUrl: './certificaciones.component.css'
})
export class CertificacionesComponent implements OnInit {
  public loading: boolean = false;
  public certificaciones: Certificacion[] = [];
  public certificacion = new Certificacion;
  @Output() closeModal = new EventEmitter();
  @Output() messageEvent = new EventEmitter<Certificacion>();
  titulosColumnas = [
    'N° CERT.',
    'N.DE SOLICITUD',
    'AREA ORG.',
    'PARTIDA',
    'DES. ESPECIFICA',
    'CAT. PROGRAMATICA',
    'PRECIO UNITARIO',
    'COSTO TOTAL',
    'EJECUTADO',
    'SALDO',
    'OPERACION'

  ];

  dtOptions: any = {};
  constructor(private certificacionService: CertificacionService) { }
  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      order: [[0, 'desc']],
      columnDefs: [{
        width: "100px",
        targets: 0
      },
      {
        width: "100px",
        targets: 1
      },
      {
        width: "300px",
        targets: 2
      },
      {
        width: "50px",
        targets: 3
      },
      {
        width: "200px",
        targets: 4
      },
      {
        width: "100px",
        targets: 5
      },
      {
        width: "100px",
        targets: 6
      },
      {
        width: "100px",
        targets: 7
      },
      {
        width: "100px",
        targets: 8
      },
      {
        width: "100px",
        targets: 9
      },
      {
        width: "100px",
        targets: 10
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
    this.obtenerCertificaciones();
  }
onCloseModal(): void {
  this.closeModal.emit();
   this.messageEvent.emit(this.certificacion);

}

  setCertificacion(value: any) {
    this.certificacion = value;
    this.onCloseModal();
  }

  obtenerCertificaciones() {
    this.loading = true;
    this.certificacionService.getCertificacion()
      .subscribe((res: any) => {
        this.certificaciones = res;
        this.loading = false;
      });
  }

}