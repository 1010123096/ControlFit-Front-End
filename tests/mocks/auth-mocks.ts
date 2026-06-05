import { Page } from '@playwright/test';
import { LOGIN_SUCCESS, LOGIN_ERROR } from './data/auth';
import { GYM_ADMIN_TOKEN } from '../utils/test-utils';

export async function mockLoginSuccess(page: Page): Promise<void> {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(LOGIN_SUCCESS),
    });
  });
}

export async function mockLoginError(page: Page): Promise<void> {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify(LOGIN_ERROR),
    });
  });
}

export async function mockAuthWithToken(page: Page): Promise<void> {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ mensaje: 'Ok', token: GYM_ADMIN_TOKEN }),
    });
  });
}
