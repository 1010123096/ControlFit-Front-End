export interface Membresia {
  id: number;
  nombre: string;
  duracionDias: number;
  precio: number;
  estado: boolean;
  gimnasioId: number;
  maximoIngresosPorDia: number;
  maximoIngresosPorSemana: number;
  maximoIngresosTotales: number;
}

export interface CrearMembresia {
  nombre: string;
  duracionDias: number;
  precio: number;
  maximoIngresosPorDia: number;
  maximoIngresosPorSemana: number;
  maximoIngresosTotales: number;
  gimnasioId: number;
}
