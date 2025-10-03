import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-menu',
  template: `
    <div class="menu-scroll-content" style="padding: 10px;">
      <ul class="navigation-menu">
        <li
          app-menuitem
          *ngFor="let item of model; let i = index"
          [item]="item"
          [index]="i"
          [root]="true"
          style="background-color: #ededed; color: white; border-bottom: 2px solid #ffffff; border-radius: 8px; padding: 5px;"
        ></li>
      </ul>
    </div>
  `,
  styles: [
    `
      .navigation-menu {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      ::ng-deep .layout-wrapper .layout-sidebar .layout-tabmenu .layout-tabmenu-contents .layout-tabmenu-content .layout-submenu-content .navigation-menu li ul li a {
        padding: 15px !important;
      }
    `
  ]
})
export class AppMenuComponent implements OnInit {
  public model: any[] = [];

  ngOnInit() {
    // Definir el menú estático
    this.model = [
      {
        label: 'Menú Principal',
        icon: 'pi pi-home', // Puedes cambiar el icono según prefieras
        items: [
          {
            label: 'Afiliaciones',
            icon: 'pi pi-chart-pie', // Icono para Afiliaciones
            routerLink: '/inicio/dashboard-afiliaciones',
            items: [] // Sin submenús
          },
          {
            label: 'Consulta Externa',
            icon: 'pi pi-chart-pie', // Icono para Consulta Externa
            routerLink: '/inicio/dashboard-consulta-externa',
            items: [] // Sin submenús
          }
        ],
        expanded: true // Para que el menú padre esté expandido por defecto
      }
    ];
  }
}