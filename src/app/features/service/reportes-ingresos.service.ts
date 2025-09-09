import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesIngresosService {
 private apiUrl = environment.apiUrl + 'api';
  constructor(private http: HttpClient) { }
getReportePorTipoIngreso(fechaInicio: string, fechaFin: string, tipo_ingres: string,lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-tipo-ingreso/${fechaInicio}/${fechaFin}/${tipo_ingres}/${lugar}`,
    {
      responseType: 'blob' as const,
      headers: new HttpHeaders({'Accept': 'application/pdf'})
    }
  );
}
getReporteTipoIngreso(fechaInicio: string, fechaFin: string, lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso/${fechaInicio}/${fechaFin}/${lugar}`,
    {
      responseType: 'blob' as const,
      headers: new HttpHeaders({'Accept': 'application/pdf'})
    }
  );
}
getReportePorTipoRubro(fechaInicio: string, fechaFin: string, nombre: string, lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-tipo-rubro/${fechaInicio}/${fechaFin}/${nombre}/${lugar}`,
    {
      responseType: 'blob' as const,
      headers: new HttpHeaders({'Accept': 'application/pdf'})
    }
  );
}
getReporteTipoRubro(fechaInicio: string, fechaFin: string, lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-rubro/${fechaInicio}/${fechaFin}/${lugar}`,
    {
      responseType: 'blob' as const,
      headers: new HttpHeaders({'Accept': 'application/pdf'})
    }
  );
}
getReporteResumenRubro(fechaInicio: string, fechaFin: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-resumen-rubros/${fechaInicio}/${fechaFin}`,
    {
      responseType: 'blob' as const,
      headers: new HttpHeaders({'Accept': 'application/pdf'})
    }
  );
}
getReporteResumenlugarRubro(fechaInicio: string, fechaFin: string, lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-resumen-rubros-lugar/${fechaInicio}/${fechaFin}/${lugar}`,
    {
      responseType: 'blob' as const,
      headers: new HttpHeaders({'Accept': 'application/pdf'})
    }
  );
}
getReporteResumenlugarEmision(fechaInicio: string, fechaFin: string, lugar: string, tipo_emision: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-emision-lugar/${fechaInicio}/${fechaFin}/${lugar}/${tipo_emision}`,
    {
      responseType: 'blob' as const,
      headers: new HttpHeaders({'Accept': 'application/pdf'})
    }
  );
}
getReporteResumenEmision(fechaInicio: string, fechaFin: string, tipo_emision: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-emision/${fechaInicio}/${fechaFin}/${tipo_emision}`,
    {
      responseType: 'blob' as const,
      headers: new HttpHeaders({'Accept': 'application/pdf'})
    }
  );
}
/* en formato Excel */
getReporteTipoIngresoExcel(fechaInicio: string, fechaFin: string, lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-excel/${fechaInicio}/${fechaFin}/${lugar}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}

getReportePorTipoIngresoExcel(fechaInicio: string, fechaFin: string, tipo_ingres: string,lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-tipo-ingreso-excel/${fechaInicio}/${fechaFin}/${tipo_ingres}/${lugar}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
getReportePorTipoRubroExcel(fechaInicio: string, fechaFin: string, lugar: string, nombre: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-tipo-rubro-excel/${fechaInicio}/${fechaFin}/${lugar}/${nombre}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
getReporteTipoRubroExcel(fechaInicio: string, fechaFin: string, lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-rubro-excel/${fechaInicio}/${fechaFin}/${lugar}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
getReportePorLugarResumenExcel(fechaInicio: string, fechaFin: string, lugar: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-resumen-rubros-lugar-excel/${fechaInicio}/${fechaFin}/${lugar}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
getReporteResumenRubroExcel(fechaInicio: string, fechaFin: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-resumen-rubros-excel/${fechaInicio}/${fechaFin}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
getReportePorLugarEmisionExcel(fechaInicio: string, fechaFin: string, lugar: string, tipo_emision: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-emision-lugar-excel/${fechaInicio}/${fechaFin}/${lugar}/${tipo_emision}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
getReporteEmisionExcel(fechaInicio: string, fechaFin: string, tipo_emision: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/ingreso-reportes/reporte-ingreso-emision-excel/${fechaInicio}/${fechaFin}/${tipo_emision}`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    }
  );
}
}


