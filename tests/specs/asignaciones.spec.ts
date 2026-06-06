import { test, expect } from '../fixtures/test-fixture';
import { setAuthToken, GYM_ADMIN_TOKEN } from '../utils/test-utils';
import { mockAsignacionesSuccess, mockAsignacionesEmpty, mockAsignacionesError, mockAsignacionEliminar } from '../mocks/asignaciones-mocks';

test.describe('Asignaciones', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
  });

  test('should display list of asignaciones on load', async ({ page, asignacionesPage }) => {
    await mockAsignacionesSuccess(page);
    await asignacionesPage.navigateTo();
    await expect(asignacionesPage.table).toBeVisible();
  });

  test('should show empty state when no asignaciones', async ({ page, asignacionesPage }) => {
    await mockAsignacionesEmpty(page);
    await asignacionesPage.navigateTo();
    await expect(asignacionesPage.emptyState).toBeVisible();
  });

  test('should show error state on API failure', async ({ page, asignacionesPage }) => {
    await mockAsignacionesError(page);
    await asignacionesPage.navigateTo();
    await expect(asignacionesPage.errorState).toBeVisible();
  });

  test('should create a new asignacion', async ({ page, asignacionesPage }) => {
    await mockAsignacionesEmpty(page);
    await mockAsignacionesSuccess(page);
    await page.route('**/api/miembros/obtenerTodos', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'ok', data: [{ id: 1, nombreCompleto: 'Juan Pérez', correo: 'juan@test.com', telefono: '123', gimnasioId: 1 }], total: 1 }) });
    });
    await page.route('**/api/Membresia', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'ok', data: [{ id: 1, nombre: 'Mensual', duracionDias: 30, precio: 50, estado: true, gimnasioId: 1, maximoIngresosPorDia: 1, maximoIngresosPorSemana: 5, maximoIngresosTotales: 30 }], total: 1 }) });
      } else {
        await route.fallback();
      }
    });
    await asignacionesPage.navigateTo();
    await asignacionesPage.abrirCrearDialog();
    await asignacionesPage.fillAsignacionForm('Juan', 'Mensual');
    await asignacionesPage.guardarDialog();
  });
});
