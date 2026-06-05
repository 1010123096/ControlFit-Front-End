export interface Miembro {
  id: number;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  gimnasioId: number;
  fechaCreacion?: string;
}

export interface CrearMiembro {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  gimnasioId: number;
}

export interface ActualizarMiembro {
  id: number;
  nombreCompleto: string;
  correo: string;
  telefono: string;
}
