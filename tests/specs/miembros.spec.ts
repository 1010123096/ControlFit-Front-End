import { test, expect } from '../fixtures/test-fixture';
import { setAuthToken, GYM_ADMIN_TOKEN } from '../utils/test-utils';
import { mockMiembrosSuccess, mockMiembrosEmpty, mockMiembrosError, mockMiembroCrear, mockMiembroEliminar } from '../mocks/miembros-mocks';

test.describe('Miembros CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
  });

  test('should display list of miembros on load', async ({ page, miembrosPage }) => {
    await mockMiembrosSuccess(page);
    await miembrosPage.navigateTo();
    await expect(async () => {
      await expect(miembrosPage.table).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });
  });

  test('should show empty state when no miembros', async ({ page, miembrosPage }) => {
    await mockMiembrosEmpty(page);
    await miembrosPage.navigateTo();
    await expect(async () => {
      await expect(miembrosPage.emptyState).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });
  });

  test('should show error state on API failure', async ({ page, miembrosPage }) => {
    await mockMiembrosError(page);
    await miembrosPage.navigateTo();
    await expect(async () => {
      await expect(miembrosPage.errorState).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });
  });

  test('should create a new miembro', async ({ page, miembrosPage }) => {
    await mockMiembrosEmpty(page);
    await mockMiembroCrear(page);
    await miembrosPage.navigateTo();
    await miembrosPage.abrirCrearDialog();
    await page.waitForTimeout(500);
    await miembrosPage.fillMiembroForm('Carlos López', 'carlos@test.com', '555-0103');
    await page.waitForTimeout(500);
    await miembrosPage.guardarDialog();
  });

  test('should delete a miembro', async ({ page, miembrosPage }) => {
    await mockMiembrosSuccess(page);
    await mockMiembroEliminar(page);
    await miembrosPage.navigateTo();
    page.on('dialog', (dialog) => dialog.accept());
    await miembrosPage.firstDeleteButton.click();
  });
});
