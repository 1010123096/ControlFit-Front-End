import { Routes } from '@angular/router';
export const ASISTENCIAS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/listado/listado.component').then(m => m.ListadoComponent) },
  { path: 'registrar', loadComponent: () => import('./pages/registrar/registrar.component').then(m => m.RegistrarComponent) },
];
