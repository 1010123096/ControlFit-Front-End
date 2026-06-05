import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtDecodedService } from '../services/jwt-decoded.service';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private jwtDecodedService: JwtDecodedService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    const token = this.tokenService.getToken();
    if (!token || this.jwtDecodedService.isTokenExpired()) {
      this.tokenService.clearToken();
      return this.router.parseUrl('/');
    }
    return true;
  }
}
