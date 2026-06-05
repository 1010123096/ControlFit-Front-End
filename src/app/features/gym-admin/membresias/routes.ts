import { Routes } from '@angular/router';
export const MEMBRESIAS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/membresias/membresias.component').then(m => m.MembresiasComponent) },
];
