import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'super-admin',
    loadChildren: () => import('./features/super-admin/routes').then(m => m.SUPER_ADMIN_ROUTES)
  },
  {
    path: 'gym-admin',
    loadChildren: () => import('./features/gym-admin/routes').then(m => m.GYM_ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: '',
  },
];
