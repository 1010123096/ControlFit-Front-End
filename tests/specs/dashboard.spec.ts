import { test, expect } from '../fixtures/test-fixture';
import { setAuthToken, GYM_ADMIN_TOKEN } from '../utils/test-utils';
import { mockDashboardSuccess, mockDashboardError } from '../mocks/dashboard-mocks';

test.describe('Gym Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page, GYM_ADMIN_TOKEN);
  });

  test('should display stats on successful load', async ({ page, dashboardPage }) => {
    await mockDashboardSuccess(page);
    await dashboardPage.navigateTo();
    await expect(dashboardPage.heading).toBeVisible();
    const cards = await dashboardPage.getStatCards();
    await expect(cards.first()).toBeVisible();
  });

  test('should show loading state', async ({ page, dashboardPage }) => {
    await page.route('**/api/miembros/obtenerTodos', async () => {});
    await dashboardPage.navigateTo();
    await expect(dashboardPage.loadingSpinner).toBeVisible();
  });

  test('should show error state on API failure', async ({ page, dashboardPage }) => {
    await mockDashboardError(page);
    await dashboardPage.navigateTo();
    await expect(dashboardPage.errorState).toBeVisible();
  });
});
