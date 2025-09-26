import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { ingresos } from '../models/ingresos';
@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  private apiUrl = environment.apiUrl + 'api';

  constructor(private http: HttpClient) { }

  getIngresos(): Observable<any> {
    const url = `${this.apiUrl}/ingresos/listar-ingresos`;
    return this.http.get<any>(url);
  }
  postIngresos(ingresos: any) {
    const url = `${this.apiUrl}/ingresos/`
    return this.http.post(url, ingresos)

  }
  updateIngresos(ingresos: ingresos, id_ingresos: string): Observable<ingresos> {
    const url = `${this.apiUrl}/ingresos/${id_ingresos}`;
    return this.http.put(url, ingresos).pipe(
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
  getIngresosUno(id_ingresos: string): Observable<any> {
    const url = `${this.apiUrl}/ingresos/${id_ingresos}`;
    return this.http.get<any>(url);
  }
  deleteIngresos(id_ingresos: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ingresos/${id_ingresos}`); // Corresponds to DELETE /api/ingreso-empresa/:id
  }

    getTipoIngreso(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-tipo`
    return this.http.get<any>(url);
  }
  getLastNumDeposito(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/ingresos/`);
  }
  getLastNumFactura(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/ingresos/maximonumFact`);
  }
getReporteDiariolugar(fecha: string, lugar: string): Observable<Blob> {

  const url = `${this.apiUrl}/ingresos/reporte-informe-diario/${fecha}/${lugar}`;
  return this.http.get(url, { responseType: 'blob' });
}
getReporteDiario(fecha: string): Observable<Blob> {

  const url = `${this.apiUrl}/ingresos/reporte-informe-diario/${fecha}`;
  return this.http.get(url, { responseType: 'blob' });
}
getReporteDiariolugarExcel(fechaInicio: string, lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingresos/reporte-informe-diario-excel/${fechaInicio}/${lugar}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
getReporteDiarioExcel(fechaInicio: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingresos/reporte-informe-diario-excel/${fechaInicio}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
getReporteRecibo(id_ingresos: number): Observable<Blob> {
  const url = `${this.apiUrl}/ingresos/reporte-recibo/${id_ingresos}`;
  return this.http.get(url, { responseType: 'blob' });
}

extractPdfData(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/ingresos/import-pdf`, formData);
}
importDocumentos(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/ingresos/importar-excel`, formData);
}
}