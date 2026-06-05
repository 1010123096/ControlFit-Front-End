import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { JwtDecodedService } from '../services/jwt-decoded.service';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private jwtDecodedService: JwtDecodedService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const gimnasioId = this.jwtDecodedService.getGimnasioId();
    const role = this.jwtDecodedService.getRole();
    const requiredRoles = route.data?.['roles'] as string[];

    if (requiredRoles && role && !requiredRoles.includes(role)) {
      this.notificationService.showError('No tienes permisos para acceder a esta sección');
      return this.router.parseUrl('/');
    }

    if (role === 'Super Admin') {
      return true;
    }

    if (!gimnasioId || gimnasioId <= 0) {
      this.notificationService.showError('No tienes un gimnasio asignado');
      return this.router.parseUrl('/');
    }

    return true;
  }
}
