import { test, expect } from '../fixtures/test-fixture';
import { setAuthToken, SUPER_ADMIN_TOKEN } from '../utils/test-utils';
import { mockGimnasiosSuccess, mockGimnasiosEmpty, mockGimnasiosError, mockGimnasioCrear, mockGimnasioEliminar } from '../mocks/gimnasios-mocks';

test.describe('Super Admin Gimnasios CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page, SUPER_ADMIN_TOKEN);
  });

  test('should display list of gimnasios on load', async ({ page, superAdminGimnasiosPage }) => {
    await mockGimnasiosSuccess(page);
    await superAdminGimnasiosPage.navigateTo();
    await expect(superAdminGimnasiosPage.table).toBeVisible();
  });

  test('should show empty state when no gimnasios', async ({ page, superAdminGimnasiosPage }) => {
    await mockGimnasiosEmpty(page);
    await superAdminGimnasiosPage.navigateTo();
    await expect(superAdminGimnasiosPage.emptyState).toBeVisible();
  });

  test('should show error state on API failure', async ({ page, superAdminGimnasiosPage }) => {
    await mockGimnasiosError(page);
    await superAdminGimnasiosPage.navigateTo();
    await expect(superAdminGimnasiosPage.errorState).toBeVisible();
  });

  test('should create a new gimnasio', async ({ page, superAdminGimnasiosPage }) => {
    await mockGimnasiosEmpty(page);
    await mockGimnasioCrear(page);
    await superAdminGimnasiosPage.navigateTo();
    await superAdminGimnasiosPage.abrirCrearDialog();
    await superAdminGimnasiosPage.fillGimnasioForm('Gimnasio Sur', 'Av. Sur 789', '555-3000');
    await superAdminGimnasiosPage.guardarDialog();
  });

  test('should delete a gimnasio', async ({ page, superAdminGimnasiosPage }) => {
    await mockGimnasiosSuccess(page);
    await mockGimnasioEliminar(page);
    await superAdminGimnasiosPage.navigateTo();
    page.on('dialog', (dialog) => dialog.accept());
    await superAdminGimnasiosPage.firstDeleteButton.click();
  });
});
