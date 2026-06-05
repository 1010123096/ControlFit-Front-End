import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Gimnasio } from '../models/gimnasio.model';

@Injectable({ providedIn: 'root' })
export class GimnasiosService {
  private apiUrl = `${environment.apiUrl}/gimnasios`;
  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Gimnasio[]> { return this.http.get<Gimnasio[]>(`${this.apiUrl}/obtenerTodos`); }
  crear(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/Registro`, data); }
  actualizar(data: any): Observable<any> { return this.http.put(`${this.apiUrl}/actualizar`, data); }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/eliminar?id=${id}`); }
}
