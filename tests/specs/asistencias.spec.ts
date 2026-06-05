import { test, expect } from '../fixtures/test-fixture';
import { setAuthToken, GYM_ADMIN_TOKEN } from '../utils/test-utils';
import { mockAsistenciasSuccess, mockAsistenciasEmpty, mockAsistenciasError, mockAsistenciaRegistrar } from '../mocks/asistencias-mocks';

test.describe('Asistencias', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
  });

  test('should display list of asistencias on load', async ({ page, asistenciasPage }) => {
    await mockAsistenciasSuccess(page);
    await asistenciasPage.navigateTo();
    await expect(asistenciasPage.table).toBeVisible();
  });

  test('should show empty state when no asistencias', async ({ page, asistenciasPage }) => {
    await mockAsistenciasEmpty(page);
    await asistenciasPage.navigateTo();
    await expect(asistenciasPage.emptyState).toBeVisible();
  });

  test('should show error state on API failure', async ({ page, asistenciasPage }) => {
    await mockAsistenciasError(page);
    await asistenciasPage.navigateTo();
    await expect(asistenciasPage.errorState).toBeVisible();
  });

  test('should register a new asistencia', async ({ page, asistenciasPage }) => {
    await mockAsistenciasEmpty(page);
    await mockAsistenciaRegistrar(page);
    await asistenciasPage.navigateToRegistrar();
    await asistenciasPage.fillRegistrarForm('1');
    await asistenciasPage.submitRegistrar();
    await expect(page).toHaveURL(/gym-admin\/asistencias$/);
  });
});
