import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Gastos } from '../models/gastos';



@Injectable({
  providedIn: 'root'
})
export class GastosService {
 private apiUrl = environment.apiUrl + 'api';

  constructor(private http: HttpClient) { }

  getGastos(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto/listar-gastos`;
    return this.http.get<any>(url);
  }
  postGastos(gastos: any) {
    const url = `${this.apiUrl}/ingreso-gasto/`
    return this.http.post(url, gastos)

  }
  updateGatos(gastos: Gastos, id_gasto: string): Observable<Gastos> {
    const url = `${this.apiUrl}/ingreso-gasto/${id_gasto}`;
    return this.http.put(url, gastos).pipe(
      map((response: any) => response),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
  getGastosUno(id_gasto: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto/${id_gasto}`;
    return this.http.get<any>(url);
  }
  deleteGastos(id_gasto: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ingreso-gasto/${id_gasto}`); 
  }

  getCertificacion(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto-certificacion`;
    return this.http.get<any>(url);
  }
  getCertificacionUno(id_certificacion: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto-certificacion/${id_certificacion}`;
    return this.http.get<any>(url);
  }



}
