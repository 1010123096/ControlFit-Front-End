import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly errorState: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('app-loading-spinner');
    this.errorState = page.locator('app-error-state');
    this.heading = page.getByRole('heading', { name: 'Panel de Administración' });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/gym-admin/dashboard');
  }

  getStatCards() {
    return this.page.locator('mat-card');
  }
}
