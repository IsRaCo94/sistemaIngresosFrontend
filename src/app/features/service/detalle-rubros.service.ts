import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RubrosDetalle } from '../models/rubrosDetalle';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DetalleRubrosService {
private apiUrl = environment.apiUrl + 'api';

  constructor(private http: HttpClient) { }

  getDetRubros(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-rubros-detalle/listar-rubros-detalle`;
    return this.http.get<any>(url);
  }
    getRubros(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-rubros/listar-rubros`;
    return this.http.get<any>(url);
  }

  postDetRubro(detalles: any) {
    const url = `${this.apiUrl}/ingreso-rubros-detalle/`
    return this.http.post(url, detalles)

  }
  updateDetRubro(detalles: RubrosDetalle, id_detalle_rubro: string): Observable<RubrosDetalle> {
    console.log(id_detalle_rubro);
    
    const url = `${this.apiUrl}/ingreso-rubros-detalle/${id_detalle_rubro}`;
    return this.http.put(url, detalles).pipe(
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
  getDetRubroUno(id_detalle_rubro: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-rubros-detalle/${id_detalle_rubro}`;
    return this.http.get<any>(url);
  }
  deleteDetRubro(id_detalle_rubro:  number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/ingreso-rubros-detalle/${id_detalle_rubro}`);
  }
}
