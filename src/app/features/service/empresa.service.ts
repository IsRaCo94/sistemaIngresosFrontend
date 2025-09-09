import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { empresa } from '../models/empresa';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  checkIfCodigoExists(codigo: string) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = environment.apiUrl + 'api';
  constructor(private http: HttpClient) { }
  getAllEmpresas(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-empresa/getAllEmpresas`;
    return this.http.get<any>(url);
  }
  getEmpresa(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-empresa/listar-empresas`;
    return this.http.get<any>(url);
  }
  postEmpresa(empresa: any) {
    const url = `${this.apiUrl}/ingreso-empresa/`
    return this.http.post(url, empresa)

  }
  updateEmpresa(empresa: empresa, id_empresa: string): Observable<empresa> {
    const url = `${this.apiUrl}/ingreso-empresa/${id_empresa}`;
    return this.http.put(url, empresa).pipe(
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
  getEmpresaUno(id_empresa: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-empresa/${id_empresa}`;
    return this.http.get<any>(url);
  }

  deleteEmpresas(id_empresa: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ingreso-empresa/${id_empresa}`); 
  }
importEmpresas(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/ingreso-empresa/importar-excel`, formData);
}
  // importEmpresas(empresa: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/ingreso-empresa/importar-excel`, empresa);
  // }

}

