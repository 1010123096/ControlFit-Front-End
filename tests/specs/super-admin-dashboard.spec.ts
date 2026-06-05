import { test, expect } from '../fixtures/test-fixture';
import { setAuthToken, SUPER_ADMIN_TOKEN } from '../utils/test-utils';
import { mockGimnasiosSuccess, mockGimnasiosEmpty, mockGimnasiosError } from '../mocks/gimnasios-mocks';

test.describe('Super Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page, SUPER_ADMIN_TOKEN);
  });

  test('should display dashboard heading on load', async ({ page, superAdminDashboardPage }) => {
    await mockGimnasiosSuccess(page);
    await superAdminDashboardPage.navigateTo();
    await expect(superAdminDashboardPage.heading).toBeVisible();
  });

  test('should show error state on API failure', async ({ page, superAdminDashboardPage }) => {
    await mockGimnasiosError(page);
    await superAdminDashboardPage.navigateTo();
    await expect(superAdminDashboardPage.errorState).toBeVisible();
  });
});
