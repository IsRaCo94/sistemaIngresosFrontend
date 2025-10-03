// import { Component } from '@angular/core';
// import { PRIME_NG_CONFIG } from 'primeng/config';
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   standalone: false,
//   styleUrl: './app.component.css'  // <-- corrección aquí
// })
// export class AppComponent {
//   title = 'ingresos';
// }
import {Component, OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit{

    layoutMode = 'static';

    darkMenu = false;

    inputStyle = 'outlined';

    ripple = true;

    compactMode = false;

   

    ngOnInit() {
      
    }
}       
