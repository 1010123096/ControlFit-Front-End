import { test, expect } from '../fixtures/test-fixture';
import { setAuthToken, GYM_ADMIN_TOKEN } from '../utils/test-utils';
import { mockMembresiasSuccess, mockMembresiasEmpty, mockMembresiasError, mockMembresiaEliminar } from '../mocks/membresias-mocks';

test.describe('Membresías CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
  });

  test('should display list of membresias on load', async ({ page, membresiasPage }) => {
    await mockMembresiasSuccess(page);
    await membresiasPage.navigateTo();
    await expect(async () => {
      await expect(membresiasPage.table).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });
  });

  test('should show empty state when no membresias', async ({ page, membresiasPage }) => {
    await mockMembresiasEmpty(page);
    await membresiasPage.navigateTo();
    await expect(async () => {
      await expect(membresiasPage.emptyState).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });
  });

  test('should show error state on API failure', async ({ page, membresiasPage }) => {
    await mockMembresiasError(page);
    await membresiasPage.navigateTo();
    await expect(async () => {
      await expect(membresiasPage.errorState).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 15000 });
  });

  test('should create a new membresia', async ({ page, membresiasPage }) => {
    await mockMembresiasEmpty(page);
    await mockMembresiasSuccess(page);
    await membresiasPage.navigateTo();
    await membresiasPage.abrirCrearDialog();
    await membresiasPage.fillMembresiaForm('VIP', '180', '2500');
    await membresiasPage.guardarDialog();
  });
});
