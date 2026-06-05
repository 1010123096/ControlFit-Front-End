export interface Membresia {
  id: number;
  nombre: string;
  duracionDias: number;
  precio: number;
  estado: boolean;
  gimnasioId: number;
}

export interface CrearMembresia {
  nombre: string;
  duracionDias: number;
  precio: number;
  gimnasioId: number;
}
