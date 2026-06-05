import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Historial } from '../models/historial.model';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/Historial`;

  obtenerTodos(): Observable<Historial[]> { return this.http.get<Historial[]>(this.apiUrl); }
}
