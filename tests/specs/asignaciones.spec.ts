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
    await asignacionesPage.navigateTo();
    await asignacionesPage.abrirCrearDialog();
    await asignacionesPage.fillAsignacionForm('1', '2');
    await asignacionesPage.guardarDialog();
  });
});
