import { Page, Locator } from '@playwright/test';

export class SuperAdminDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/super-admin/dashboard');
  }

  get loadingSpinner(): Locator { return this.page.locator('app-loading-spinner'); }
  get errorState(): Locator { return this.page.locator('app-error-state'); }
  get heading(): Locator { return this.page.getByRole('heading', { name: 'Panel de Super Administrador' }); }

  async getStatCards(): Promise<Locator> {
    return this.page.locator('mat-card');
  }
}
