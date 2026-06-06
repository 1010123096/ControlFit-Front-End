import { test, expect } from '../fixtures/test-fixture';
import { setAuthToken, GYM_ADMIN_TOKEN, SUPER_ADMIN_TOKEN } from '../utils/test-utils';

test.describe('Navigation', () => {
  test('should navigate to gym-admin dashboard', async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
    await page.route('**/api/miembros/obtenerTodos', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ totalMiembros: 0, miembrosActivos: 0, membresiasVencidas: 0, asistenciasHoy: 0 }) });
    });
    await page.goto('/gym-admin/dashboard');
    await expect(page.locator('h1')).toContainText('Panel de Administración');
  });

  test('should navigate to miembros page', async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
    await page.route('**/api/miembros/obtenerTodos', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/gym-admin/miembros');
    await expect(page.locator('h1')).toContainText('Miembros');
  });

  test('should navigate to membresias page', async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
    await page.route('**/api/Membresia', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/gym-admin/membresias');
    await expect(page.locator('h1')).toContainText('Membresías');
  });

  test('should navigate to asignaciones page', async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
    await page.route('**/api/asignacion', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/gym-admin/asignaciones');
    await expect(page.locator('h1')).toContainText('Asignaciones');
  });

  test('should navigate to asistencias page', async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
    await page.route('**/api/Asistencia', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/gym-admin/asistencias');
    await expect(page.locator('h1')).toContainText('Asistencias');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/gym-admin/dashboard');
    await expect(page.locator('.login-wrapper')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
    await page.route('**/api/dashboard/gym-admin', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'ok', data: { totalMiembros: 0, miembrosActivos: 0, membresiasVencidas: 0, asistenciasHoy: 0 } }) });
    });
    await page.goto('/gym-admin/dashboard');
    await page.locator('.user-btn').click();
    await page.locator('button').filter({ hasText: 'Cerrar sesión' }).click();
    await expect(page.locator('.login-wrapper')).toBeVisible();
  });
});
