import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'Ha ocurrido un error inesperado';

      if (error.status === 401) {
        errorMsg = 'CREDENCIALES INVALIDAS';
      } else if (error.status === 403) {
        errorMsg = 'No tienes permisos para realizar esta acción';
      } else if (error.status === 404) {
        errorMsg = 'El recurso solicitado no existe';
      } else if (error.status === 500) {
        errorMsg = 'Error interno del servidor';
      } else if (error.error?.mensaje) {
        errorMsg = error.error.mensaje;
      } else if (error.error?.error) {
        errorMsg = error.error.error;
      }

      notificationService.showError(errorMsg);
      return throwError(() => error);
    })
  );
};
