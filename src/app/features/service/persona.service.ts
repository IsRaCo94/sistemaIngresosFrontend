import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { persona } from '../models/persona';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
 private apiUrl = environment.apiUrl + 'api';
  constructor(private http: HttpClient) { }
  getPersona(): Observable<any> {
    const url = `${this.apiUrl}/ingreso-persona/listar-personas`;
    return this.http.get<any>(url);
  }
  postPersona(personas: any) {
    const url = `${this.apiUrl}/ingreso-persona/`
    return this.http.post(url, personas)

  }
  updatePersona(personas: persona, id_persona: string): Observable<persona> {
    const url = `${this.apiUrl}/ingreso-persona/${id_persona}`;
    return this.http.put(url, personas).pipe(
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
  getPersonaUno(id_persona: string): Observable<any> {
    const url = `${this.apiUrl}/ingreso-persona/${id_persona}`;
    return this.http.get<any>(url);
  }
  deletePersona(id_persona: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ingreso-persona/${id_persona}`); // Corresponds to DELETE /api/ingreso-empresa/:id
  }

}
