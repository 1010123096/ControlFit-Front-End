import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuditLogPage, AuditLogQuery } from '../models/audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private apiUrl = `${environment.apiUrl}/auditoria`;

  constructor(private http: HttpClient) {}

  listar(query: AuditLogQuery = {}): Observable<AuditLogPage> {
    let params = new HttpParams()
      .set('page', String(query.page ?? 1))
      .set('pageSize', String(query.pageSize ?? 25));

    if (query.gimnasioId != null) params = params.set('gimnasioId', String(query.gimnasioId));
    if (query.accion) params = params.set('accion', query.accion);
    if (query.fechaInicio) params = params.set('fechaInicio', query.fechaInicio);
    if (query.fechaFin) params = params.set('fechaFin', query.fechaFin);

    return this.http.get<AuditLogPage>(this.apiUrl, { params });
  }
}
