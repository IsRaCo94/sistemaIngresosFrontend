import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Rubros } from '../models/rubros';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RubrosService {
 private apiUrl = environment.apiUrl + 'api';
  constructor(private http: HttpClient) { }
 getRubros(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-rubros/listar-rubros`;
    return this.http.get<any>(url);
  }
  postRubros(rubro: any) {
    const url = `${this.apiUrl}/ingreso-rubros/`
    return this.http.post(url, rubro)

  }
  updateRubros(rubros: Rubros, id_tipo_rubro: string): Observable<Rubros> {
    const url = `${this.apiUrl}/ingreso-rubros/${id_tipo_rubro}`;
    return this.http.put(url, rubros).pipe(
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
  getRubrosUno(id_tipo_rubro: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-rubros/${id_tipo_rubro}`;
    return this.http.get<any>(url);
  }
  deleteRubros(id_tipo_rubro: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ingreso-rubros/${id_tipo_rubro}`); // Corresponds to DELETE /api/ingreso-empresa/:id
  }

}
