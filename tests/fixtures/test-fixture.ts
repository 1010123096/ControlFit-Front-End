import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { MiembrosPage } from '../pages/miembros.page';
import { MembresiasPage } from '../pages/membresias.page';
import { AsignacionesPage } from '../pages/asignaciones.page';
import { AsistenciasPage } from '../pages/asistencias.page';
import { SuperAdminDashboardPage } from '../pages/super-admin-dashboard.page';
import { SuperAdminGimnasiosPage } from '../pages/super-admin-gimnasios.page';

type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  miembrosPage: MiembrosPage;
  membresiasPage: MembresiasPage;
  asignacionesPage: AsignacionesPage;
  asistenciasPage: AsistenciasPage;
  superAdminDashboardPage: SuperAdminDashboardPage;
  superAdminGimnasiosPage: SuperAdminGimnasiosPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  dashboardPage: async ({ page }, use) => { await use(new DashboardPage(page)); },
  miembrosPage: async ({ page }, use) => { await use(new MiembrosPage(page)); },
  membresiasPage: async ({ page }, use) => { await use(new MembresiasPage(page)); },
  asignacionesPage: async ({ page }, use) => { await use(new AsignacionesPage(page)); },
  asistenciasPage: async ({ page }, use) => { await use(new AsistenciasPage(page)); },
  superAdminDashboardPage: async ({ page }, use) => { await use(new SuperAdminDashboardPage(page)); },
  superAdminGimnasiosPage: async ({ page }, use) => { await use(new SuperAdminGimnasiosPage(page)); },
});

export { expect } from '@playwright/test';
