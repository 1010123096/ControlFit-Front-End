import { GYM_ADMIN_TOKEN, SUPER_ADMIN_TOKEN } from '../../utils/test-utils';

export const LOGIN_SUCCESS = {
  mensaje: 'Inicio de sesión exitoso',
  token: GYM_ADMIN_TOKEN,
};

export const LOGIN_ERROR = {
  mensaje: 'Credenciales inválidas',
};

export const LOGIN_PAYLOAD = {
  correo: 'admin@test.com',
  contrasena: 'password123',
};
