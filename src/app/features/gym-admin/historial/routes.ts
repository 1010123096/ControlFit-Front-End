import { Routes } from '@angular/router';
export const HISTORIAL_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/historial/historial.component').then(m => m.HistorialComponent) },
];
