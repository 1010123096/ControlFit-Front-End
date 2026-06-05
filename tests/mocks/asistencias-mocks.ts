import { Page } from '@playwright/test';
import { ASISTENCIAS_LISTA } from './data/asistencias';

export async function mockAsistenciasSuccess(page: Page): Promise<void> {
  await page.route('**/api/Asistencia', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ASISTENCIAS_LISTA) });
    } else {
      await route.fallback();
    }
  });
}

export async function mockAsistenciasEmpty(page: Page): Promise<void> {
  await page.route('**/api/Asistencia', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
}

export async function mockAsistenciasError(page: Page): Promise<void> {
  await page.route('**/api/Asistencia', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Error' }) });
  });
}

export async function mockAsistenciaRegistrar(page: Page): Promise<void> {
  await page.route('**/api/Asistencia/registrar', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ mensaje: 'Registrada' }) });
  });
}
