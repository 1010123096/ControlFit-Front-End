import { Routes } from '@angular/router';
export const ASISTENCIAS_LEGACY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/listado/listado.component').then(m => m.AsistenciasListadoLegacyComponent) },
  { path: 'filtrar', loadComponent: () => import('./pages/filtrar/filtrar.component').then(m => m.FiltrarComponent) },
  { path: 'registrar', loadComponent: () => import('./pages/registrar/registrar.component').then(m => m.RegistrarAsistenciaLegacyComponent) },
];
