import { Component } from '@angular/core';
import { PRIME_NG_CONFIG } from 'primeng/config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'  // <-- corrección aquí
})
export class AppComponent {
  title = 'ingresos';
}
