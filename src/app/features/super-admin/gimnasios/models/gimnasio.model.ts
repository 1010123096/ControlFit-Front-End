export interface Gimnasio {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: boolean;
}

export interface CrearGimnasio {
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface ActualizarGimnasio {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}
