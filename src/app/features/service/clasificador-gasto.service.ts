import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClasificadorGastoService {
  private apiUrl = environment.apiUrl + 'api';
   
  constructor(private http: HttpClient) { }
 getclasificacionGastos(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto-clasificador/listar-clasificaciones`;
    return this.http.get<any>(url);
  }

}
