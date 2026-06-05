import { Routes } from '@angular/router';
export const MIEMBROS_LEGACY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/miembros/miembros.component').then(m => m.MiembrosLegacyComponent) },
];
