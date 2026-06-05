import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';

export const GYM_ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/gym-admin-layout.component').then(m => m.GymAdminLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/routes').then(m => m.DASHBOARD_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Admin Gimnasio'] }
      },
      {
        path: 'miembros',
        loadChildren: () => import('./miembros/routes').then(m => m.MIEMBROS_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Admin Gimnasio'] }
      },
      {
        path: 'membresias',
        loadChildren: () => import('./membresias/routes').then(m => m.MEMBRESIAS_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Admin Gimnasio'] }
      },
      {
        path: 'asignaciones',
        loadChildren: () => import('./asignaciones/routes').then(m => m.ASIGNACIONES_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Admin Gimnasio'] }
      },
      {
        path: 'asistencias',
        loadChildren: () => import('./asistencias/routes').then(m => m.ASISTENCIAS_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Admin Gimnasio'] }
      },
      {
        path: 'historial',
        loadChildren: () => import('./historial/routes').then(m => m.HISTORIAL_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Admin Gimnasio'] }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
