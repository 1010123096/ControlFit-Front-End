import { test, expect } from '../fixtures/test-fixture';
import { mockLoginSuccess, mockLoginError } from '../mocks/auth-mocks';

test.describe('Login', () => {
  test('should display login form', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await expect(loginPage.correoInput).toBeVisible();
    await expect(loginPage.contrasenaInput).toBeVisible();
    await expect(loginPage.ingresarButton).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page, loginPage }) => {
    await mockLoginSuccess(page);
    await loginPage.navigateTo();
    await loginPage.login('admin@test.com', 'password123');
    await expect(page).toHaveURL(/gym-admin\/dashboard/, { timeout: 10000 });
  });

  test('should show error with invalid credentials', async ({ page, loginPage }) => {
    await mockLoginError(page);
    await loginPage.navigateTo();
    await loginPage.login('wrong@test.com', 'wrongpass');
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
  });

  test('should disable submit button when form is invalid', async ({ loginPage }) => {
    await loginPage.navigateTo();
    await expect(loginPage.ingresarButton).toBeDisabled();
  });
});
