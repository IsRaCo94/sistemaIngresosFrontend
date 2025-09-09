import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { egresos } from '../models/egresos';

@Injectable({
  providedIn: 'root'
})
export class EgresosService {
  private apiUrl = environment.apiUrl + 'api';

  constructor(private http: HttpClient) { }

  getEgresos(): Observable<any> {
    const url = `${this.apiUrl}/egresos/listar-egresos`;
    return this.http.get<any>(url);
  }
  postEgresos(egresos: any) {
    const url = `${this.apiUrl}/egresos/`
    return this.http.post(url, egresos)

  }
  updateEgresos(egresos: egresos, id_egresos: string): Observable<egresos> {
    const url = `${this.apiUrl}/egresos/${id_egresos}`;
    return this.http.put(url, egresos).pipe(
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
  getEgresosUno(id_egresos: string): Observable<any> {
    const url = `${this.apiUrl}/egresos/${id_egresos}`;
    return this.http.get<any>(url);
  }
  deleteEgresos(id_egresos: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/egresos/${id_egresos}`); // Corresponds to DELETE /api/egreso-empresa/:id
  }

}