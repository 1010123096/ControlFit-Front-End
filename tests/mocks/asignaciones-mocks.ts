import { Page } from '@playwright/test';
import { ASIGNACIONES_LISTA, ASIGNACION_NUEVA } from './data/asignaciones';

export async function mockAsignacionesSuccess(page: Page): Promise<void> {
  await page.route('**/api/asignacion', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ASIGNACIONES_LISTA) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ASIGNACION_NUEVA) });
    }
  });
}

export async function mockAsignacionesEmpty(page: Page): Promise<void> {
  await page.route('**/api/asignacion', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
}

export async function mockAsignacionesError(page: Page): Promise<void> {
  await page.route('**/api/asignacion', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Error' }) });
  });
}

export async function mockAsignacionEliminar(page: Page): Promise<void> {
  await page.route('**/api/asignacion/*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ mensaje: 'Eliminado' }) });
  });
}
