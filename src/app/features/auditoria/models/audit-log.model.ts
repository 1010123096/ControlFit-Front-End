export interface AuditLog {
  id: number;
  administradorId?: number | null;
  administradorCorreo?: string | null;
  gimnasioId?: number | null;
  gimnasioNombre?: string | null;
  accion: string;
  entidad: string;
  entidadId?: string | null;
  detalle?: string | null;
  fechaUtc: string;
}

export interface AuditLogQuery {
  gimnasioId?: number;
  accion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditLogPage {
  items: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
}

export const ACCION_LABELS: Record<string, string> = {
  'Auth.Login.Exitoso': 'Login exitoso',
  'Auth.Login.Fallido': 'Login fallido',
  'Asistencia.Registrada': 'Asistencia registrada',
  'Configuracion.Actualizada': 'Configuración actualizada',
};

export function labelAccion(accion: string): string {
  return ACCION_LABELS[accion] ?? accion;
}
