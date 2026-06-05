import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Gimnasio, CrearGimnasio, ActualizarGimnasio } from '../models/gimnasio.model';

@Injectable({ providedIn: 'root' })
export class GimnasioService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/gimnasios`;

  obtenerTodos(): Observable<Gimnasio[]> { return this.http.get<Gimnasio[]>(`${this.apiUrl}/obtenerTodos`); }
  crear(data: CrearGimnasio): Observable<any> { return this.http.post(`${this.apiUrl}/Registro`, data); }
  actualizar(data: ActualizarGimnasio): Observable<any> { return this.http.put(`${this.apiUrl}/actualizar`, data); }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/eliminar?id=${id}`); }
}
