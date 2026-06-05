import { Page } from '@playwright/test';
import { DASHBOARD_STATS } from './data/dashboard';

export async function mockDashboardSuccess(page: Page): Promise<void> {
  await page.route('**/api/miembros/obtenerTodos', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(DASHBOARD_STATS) });
  });
}

export async function mockDashboardError(page: Page): Promise<void> {
  await page.route('**/api/miembros/obtenerTodos', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Error' }) });
  });
}
