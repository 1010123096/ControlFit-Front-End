import { Routes } from '@angular/router';
export const GIMNASIOS_LEGACY_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/gimnasios/gimnasios.component').then(m => m.GimnasiosLegacyComponent) },
];
