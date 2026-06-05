import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Miembro, CrearMiembro, ActualizarMiembro } from '../models/miembro.model';

@Injectable({ providedIn: 'root' })
export class MiembrosService {
  private apiUrl = `${environment.apiUrl}/miembros`;
  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Miembro[]> { return this.http.get<Miembro[]>(`${this.apiUrl}/obtenerTodos`); }
  obtenerPorId(id: number): Observable<Miembro> { return this.http.get<Miembro>(`${this.apiUrl}/obtenerporID?id=${id}`); }
  crear(data: CrearMiembro): Observable<any> { return this.http.post(`${this.apiUrl}/Registro`, data); }
  actualizar(data: ActualizarMiembro): Observable<any> { return this.http.put(`${this.apiUrl}/actualizar`, data); }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/eliminar?id=${id}`); }
}
