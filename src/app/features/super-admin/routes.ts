import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';

export const SUPER_ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/super-admin-layout.component').then(m => m.SuperAdminLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/routes').then(m => m.DASHBOARD_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Super Admin'] }
      },
      {
        path: 'gimnasios',
        loadChildren: () => import('./gimnasios/routes').then(m => m.GIMNASIOS_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Super Admin'] }
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./configuracion/routes').then(m => m.CONFIGURACION_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Super Admin'] }
      },
      {
        path: 'auditoria',
        loadChildren: () => import('../auditoria/routes').then(m => m.AUDITORIA_ROUTES),
        canActivate: [RoleGuard],
        data: { roles: ['Super Admin'] }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
