import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { persona } from '../../../../models/persona';
import { PersonaService } from '../../../../service/persona.service';

@Component({
  selector: 'app-personas',
  standalone: false,
  templateUrl: './personas.component.html',
  styleUrl: './personas.component.css'
})
export class PersonasComponent implements OnInit {
  public loading: boolean = false;
  public personas: persona[] = [];
  public persona = new persona;
  @Output() closeModal = new EventEmitter();
  @Output() messageEvent = new EventEmitter<persona>();
  titulosColumnas = [
    'DESCRIPCION',
    'OPERACION'
  ];
  dtOptions: any = {};
  constructor(private personaService: PersonaService) { }
  ngOnInit(): void {
    this.dtOptions = {
      responsive: true,
      order: [[0, 'desc']],
      columnDefs: [{
        width: "600px",
        targets: 0
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
    this.obtenerPersonas();
  }
  onCloseModal() {
    this.closeModal.emit();
    this.messageEvent.emit(this.persona);
  }
  setPersona(value: any) {
    this.persona = value;
    this.onCloseModal();
  }

  obtenerPersonas(){
    this.loading=true;
    this.personaService.getPersona()
    .subscribe((res:any)=>{
      this.personas=res;
      this.loading=false;
    });
  }
}
