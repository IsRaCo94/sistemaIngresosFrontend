import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Cuenta } from '../models/cuenta';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class CuentaService {
 private apiUrl = environment.apiUrl + 'api';
  constructor(private http: HttpClient) { }
  getCuenta(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-cuenta/listar-cuentas`;
    return this.http.get<any>(url);
  }
  postCuenta(cuentas: any) {
    const url = `${this.apiUrl}/ingreso-cuenta/`
    return this.http.post(url, cuentas)

  }
  updateCuenta(cuentas: Cuenta, id_cuenta: string): Observable<Cuenta> {
    const url = `${this.apiUrl}/ingreso-cuenta/${id_cuenta}`;
    return this.http.put(url, cuentas).pipe(
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
  getCuentaUno(id_cuenta: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-cuenta/${id_cuenta}`;
    return this.http.get<any>(url);
  }
  deleteCuenta(id_cuenta: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ingreso-cuenta/${id_cuenta}`); // Corresponds to DELETE /api/ingreso-empresa/:id
  }

}
