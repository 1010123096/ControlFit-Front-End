export interface LoginResponse {
  mensaje: string;
  token: string;
  refreshToken: string;
  expiresAt?: string;
}
