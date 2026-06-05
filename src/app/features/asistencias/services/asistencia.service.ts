import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Asistencia } from '../models/asistencia.model';

@Injectable({ providedIn: 'root' })
export class AsistenciasService {
  private apiUrl = `${environment.apiUrl}/Asistencia`;
  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Asistencia[]> { return this.http.get<Asistencia[]>(this.apiUrl); }
  registrar(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/registrar`, data); }
}
