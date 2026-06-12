import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { TokenService } from '../services/token.service';
import { AuthService } from '../../features/auth/services/auth/auth.service';

function extractApiMessage(error: HttpErrorResponse): string | null {
  const body = error.error;
  if (!body) return null;
  if (typeof body === 'string') return body;
  if (typeof body.error === 'string') return body.error;
  if (typeof body.message === 'string') return body.message;
  if (typeof body.mensaje === 'string') return body.mensaje;
  if (typeof body.title === 'string' && body.title !== 'One or more validation errors occurred.') {
    return body.title;
  }

  const errors = body.errors;
  if (errors && typeof errors === 'object') {
    for (const key of Object.keys(errors)) {
      const value = errors[key];
      if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
      if (typeof value === 'string') return value;
    }
  }

  return null;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const handleError = (error: HttpErrorResponse) => {
    let errorMsg = 'Ha ocurrido un error inesperado';

    if (error.status === 401) {
      const isLogin = req.url.includes('/auth/login');
      const isRefresh = req.url.includes('/auth/refresh');
      errorMsg = isLogin ? 'Credenciales inválidas' : 'Sesión expirada. Inicia sesión nuevamente.';
      if (!isLogin && !isRefresh) {
        tokenService.clearAll();
        router.navigate(['/']);
      }
    } else if (error.status === 403) {
      errorMsg = 'No tienes permisos para realizar esta acción';
    } else if (error.status === 404) {
      errorMsg = 'El recurso solicitado no existe';
    } else if (error.status === 400) {
      errorMsg = extractApiMessage(error) ?? 'La solicitud no es válida';
    } else if (error.status === 500) {
      errorMsg = 'Error interno del servidor';
    } else if (error.error?.mensaje) {
      errorMsg = error.error.mensaje;
    } else {
      errorMsg = extractApiMessage(error) ?? errorMsg;
    }

    notificationService.showError(errorMsg);
    return throwError(() => error);
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const canRefresh = error.status === 401
        && !req.url.includes('/auth/login')
        && !req.url.includes('/auth/refresh');

      const refreshToken = tokenService.getRefreshToken();
      if (canRefresh && refreshToken) {
        return authService.refresh(refreshToken).pipe(
          switchMap((response) => {
            tokenService.setToken(response.token);
            if (response.refreshToken) {
              tokenService.setRefreshToken(response.refreshToken);
            }
            const cloned = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` },
            });
            return next(cloned);
          }),
          catchError((refreshError: HttpErrorResponse) => handleError(refreshError))
        );
      }

      return handleError(error);
    })
  );
};
