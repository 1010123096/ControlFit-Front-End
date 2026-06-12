import { Routes } from '@angular/router';

export const AUDITORIA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/listado/auditoria-listado.component').then(m => m.AuditoriaListadoComponent),
  },
];
