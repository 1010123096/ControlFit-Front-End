import { Routes } from '@angular/router';
export const ASIGNACIONES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/asignaciones/asignaciones.component').then(m => m.AsignacionesComponent) },
];
