export interface Configuracion {
  id: number;
  nombreSistema: string;
  correoContacto: string;
  telefonoContacto: string;
}

export interface ActualizarConfiguracion {
  nombreSistema: string;
  correoContacto: string;
  telefonoContacto: string;
}
