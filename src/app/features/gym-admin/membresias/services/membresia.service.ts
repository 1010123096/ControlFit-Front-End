import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Membresia, CrearMembresia } from '../models/membresia.model';

@Injectable({ providedIn: 'root' })
export class MembresiaService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/Membresia`;

  obtenerTodas(): Observable<Membresia[]> { return this.http.get<Membresia[]>(this.apiUrl); }
  crear(data: CrearMembresia): Observable<any> { return this.http.post(this.apiUrl, data); }
  actualizar(id: number, data: Partial<Membresia>): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, data); }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
