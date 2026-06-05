import { Page } from '@playwright/test';

export function createMockJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature');
  return `${header}.${body}.${signature}`;
}

const FAR_FUTURE_EXP = 9999999999;

export const SUPER_ADMIN_TOKEN = createMockJwt({
  unique_name: 'admin',
  email: 'admin@sistema.com',
  role: 'Super Admin',
  gimnasioId: 0,
  nombreGimnasio: '',
  exp: FAR_FUTURE_EXP,
});

export const GYM_ADMIN_TOKEN = createMockJwt({
  unique_name: 'gymadmin',
  email: 'gymadmin@gimnasio.com',
  role: 'Admin Gimnasio',
  gimnasioId: 1,
  nombreGimnasio: 'Gimnasio Central',
  exp: FAR_FUTURE_EXP,
});

export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.goto('/');
  await page.evaluate((t) => localStorage.setItem('token', t), token);
}

export async function mockApiRoute(page: Page, urlPattern: string | RegExp, responseData: unknown, status = 200): Promise<void> {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}

export async function mockApiGymAdmin(page: Page): Promise<void> {
  await setAuthToken(page, GYM_ADMIN_TOKEN);
  await mockApiRoute(page, '**/api/auth/login', { mensaje: 'Ok', token: GYM_ADMIN_TOKEN });
  await mockApiRoute(page, '**/api/miembros/obtenerTodos', []);
  await mockApiRoute(page, '**/api/Membresia', []);
  await mockApiRoute(page, '**/api/asignacion', []);
  await mockApiRoute(page, '**/api/Asistencia', []);
  await mockApiRoute(page, '**/api/miembros/obtenerTodos', { totalMiembros: 0, miembrosActivos: 0, membresiasVencidas: 0, asistenciasHoy: 0 });
}

export async function mockApiSuperAdmin(page: Page): Promise<void> {
  await setAuthToken(page, SUPER_ADMIN_TOKEN);
  await mockApiRoute(page, '**/api/auth/login', { mensaje: 'Ok', token: SUPER_ADMIN_TOKEN });
  await mockApiRoute(page, '**/api/gimnasios/obtenerTodos', []);
}
