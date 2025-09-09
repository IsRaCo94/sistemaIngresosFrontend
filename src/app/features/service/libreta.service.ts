import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Libreta } from '../models/libreta';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LibretaService {
  private apiUrl = environment.apiUrl + 'api';
  constructor(private http: HttpClient) { }
  getLibreta(): Observable<any> {
    const url = `${this.apiUrl}/libreta-origen/listar-libretas`;
    return this.http.get<any>(url);
  }
  postLibreta(libretas: any) {
    const url = `${this.apiUrl}/libreta-origen/`
    return this.http.post(url, libretas)

  }
  updateLibreta(libretas: Libreta, id_libreta: string): Observable<Libreta> {
    const url = `${this.apiUrl}/libreta-origen/${id_libreta}`;
    return this.http.put(url, libretas).pipe(
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
  getLibretaUno(id_libreta: string): Observable<any> {
    const url = `${this.apiUrl}/libreta-origen/${id_libreta}`;
    return this.http.get<any>(url);
  }
  deleteLibreta(id_libreta: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/libreta-origen/${id_libreta}`); // Corresponds to DELETE /api/ingreso-empresa/:id
  }


}
