import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Asistencia, PreviewIngreso, RegistroAsistencia } from '../models/asistencia.model';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}/Asistencia`;

  constructor(private http: HttpClient) {}

  preview(miembroId: number): Observable<PreviewIngreso> {
    return this.http.get<PreviewIngreso>(`${this.apiUrl}/preview/${miembroId}`).pipe(
      map((payload) => ({
        ...payload,
        puedeIngresar: !!payload.puedeIngresar,
        yaIngresoHoy: !!payload.yaIngresoHoy,
      }))
    );
  }

  obtenerTodas(): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(this.apiUrl);
  }

  registrar(data: RegistroAsistencia): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/registrar`, {
      miembroId: data.miembroId,
      ...(data.biometricEventId != null
        ? { fuente: 'Biometrica', biometricEventId: data.biometricEventId }
        : {}),
    });
  }
}
