import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificacion } from '../models/certificacion';

@Injectable({
  providedIn: 'root'
})
export class CertificacionService {
 
   private apiUrl = environment.apiUrl + 'api';

  constructor(private http: HttpClient) { }
 getCertificacion(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto-certificacion/listar-certificaciones`;
    return this.http.get<any>(url);
  }
    getCertificacionUno(id_certificacion: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto-certificacion/${id_certificacion}`;
    return this.http.get<any>(url);
  }
}
