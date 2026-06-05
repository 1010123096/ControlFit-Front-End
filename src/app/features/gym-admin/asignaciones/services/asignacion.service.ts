import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Asignacion } from '../models/asignacion.model';

@Injectable({ providedIn: 'root' })
export class AsignacionService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/asignacion`;

  obtenerTodas(): Observable<Asignacion[]> { return this.http.get<Asignacion[]>(this.apiUrl); }
  crear(data: any): Observable<any> { return this.http.post(this.apiUrl, data); }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
