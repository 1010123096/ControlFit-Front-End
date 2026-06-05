import { Page } from '@playwright/test';
import { MEMBRESIAS_LISTA, MEMBRESIA_NUEVA } from './data/membresias';

export async function mockMembresiasSuccess(page: Page): Promise<void> {
  await page.route('**/api/Membresia', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBRESIAS_LISTA) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBRESIA_NUEVA) });
    }
  });
}

export async function mockMembresiasEmpty(page: Page): Promise<void> {
  await page.route('**/api/Membresia', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
}

export async function mockMembresiasError(page: Page): Promise<void> {
  await page.route('**/api/Membresia', async (route) => {
    await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Error' }) });
  });
}

export async function mockMembresiaEliminar(page: Page): Promise<void> {
  await page.route('**/api/Membresia/*', async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ mensaje: 'Eliminado' }) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBRESIAS_LISTA) });
    }
  });
}
