export type FuenteAsistencia = 'Manual' | 'Biometrica';

export interface Asistencia {
  id: number;
  miembroId: number;
  nombreMiembro?: string;
  asignacionMembresiaId?: number;
  fechaHoraAcceso: string;
  fuente?: FuenteAsistencia | string;
  biometricEventId?: number | null;
}

export interface PreviewIngreso {
  miembroId: number;
  nombreMiembro: string;
  nombreMembresia?: string;
  fechaVencimiento?: string;
  puedeIngresar: boolean;
  motivoBloqueo?: string;
  yaIngresoHoy: boolean;
  ingresosSemana: number;
  maximoIngresosSemana?: number | null;
}

export interface RegistroAsistencia {
  miembroId: number;
  fuente?: FuenteAsistencia;
  biometricEventId?: number | null;
}
