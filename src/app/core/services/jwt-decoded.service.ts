import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from './token.service';

interface JwtPayload {
  sub?: string;
  unique_name?: string;
  email?: string;
  role?: string;
  gimnasioId?: number;
  GimnasioId?: number;
  nombreGimnasio?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class JwtDecodedService {
  constructor(private tokenService: TokenService) {}

  getDecodedToken(): JwtPayload | null {
    const token = this.tokenService.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    return this.getDecodedToken()?.role ?? null;
  }

  getGimnasioId(): number {
    const decoded = this.getDecodedToken();
    return decoded?.gimnasioId ?? decoded?.GimnasioId ?? 0;
  }

  getNombreGimnasio(): string | null {
    return this.getDecodedToken()?.nombreGimnasio ?? null;
  }

  getEmail(): string | null {
    return this.getDecodedToken()?.email ?? null;
  }

  isSuperAdmin(): boolean {
    return this.getRole() === 'Super Admin';
  }

  isAdminGimnasio(): boolean {
    return this.getRole() === 'Admin Gimnasio';
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded['exp']) return true;
    const expiration = (decoded['exp'] as number) * 1000;
    return Date.now() > expiration;
  }
}
