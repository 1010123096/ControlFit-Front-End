import { Page } from '@playwright/test';
import { GIMNASIOS_LISTA, GIMNASIO_NUEVO } from './data/gimnasios';

export async function mockGimnasiosSuccess(page: Page): Promise<void> {
  await page.route('**/api/gimnasios/obtenerTodos', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(GIMNASIOS_LISTA) });
  });
}

export async function mockGimnasiosEmpty(page: Page): Promise<void> {
  await page.route('**/api/gimnasios/obtenerTodos', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
}

export async function mockGimnasiosError(page: Page): Promise<void> {
  await page.route('**/api/gimnasios/obtenerTodos', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Error' }) });
  });
}

export async function mockGimnasioCrear(page: Page): Promise<void> {
  await page.route('**/api/gimnasios/Registro', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(GIMNASIO_NUEVO) });
  });
}

export async function mockGimnasioEliminar(page: Page): Promise<void> {
  await page.route('**/api/gimnasios/eliminar*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ mensaje: 'Eliminado' }) });
  });
}
