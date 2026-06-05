import { Page } from '@playwright/test';
import { MIEMBROS_LISTA, MIEMBRO_NUEVO } from './data/miembros';

export async function mockMiembrosSuccess(page: Page): Promise<void> {
  await page.route('**/api/miembros/obtenerTodos', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MIEMBROS_LISTA) });
  });
}

export async function mockMiembrosEmpty(page: Page): Promise<void> {
  await page.route('**/api/miembros/obtenerTodos', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
}

export async function mockMiembrosError(page: Page): Promise<void> {
  await page.route('**/api/miembros/obtenerTodos', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Error' }) });
  });
}

export async function mockMiembroCrear(page: Page): Promise<void> {
  await page.route('**/api/miembros/Registro', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MIEMBRO_NUEVO) });
  });
}

export async function mockMiembroEliminar(page: Page): Promise<void> {
  await page.route('**/api/miembros/eliminar*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ mensaje: 'Eliminado' }) });
  });
}
