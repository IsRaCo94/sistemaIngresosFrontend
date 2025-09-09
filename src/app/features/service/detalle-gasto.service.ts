import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { GastoDetalle } from '../models/gastoDetalle';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DetalleGastoService {
private apiUrl = environment.apiUrl + 'api';

  constructor(private http: HttpClient) { }

  getDetGasto(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto-detalle/listar-gastos-detalle`;
    return this.http.get<any>(url);
  }
  postDetGasto(detalles: any) {
    const url = `${this.apiUrl}/ingreso-gasto-detalle/`
    return this.http.post(url, detalles)

  }
  updateDetGasto(detalles: GastoDetalle, id_gasto_det: string): Observable<GastoDetalle> {
    console.log(id_gasto_det);
    
    const url = `${this.apiUrl}/ingreso-gasto-detalle/${id_gasto_det}`;
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
  getDetGastoUno(id_gasto_det: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-gasto-detalle/${id_gasto_det}`;
    return this.http.get<any>(url);
  }
  deleteDetGasto(id_gasto_det:  number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/ingreso-gasto-detalle/${id_gasto_det}`);
  }
}
