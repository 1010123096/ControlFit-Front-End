import { Page, Locator } from '@playwright/test';

export class AsistenciasPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  
  async navigateTo(): Promise<void> {
    await this.page.goto('/gym-admin/asistencias');
  }

  get loadingSpinner(): Locator { return this.page.locator('app-loading-spinner'); }
  get emptyState(): Locator { return this.page.locator('app-empty-state'); }
  get errorState(): Locator { return this.page.locator('app-error-state'); }
  get table(): Locator { return this.page.locator('table'); }
  get registrarButton(): Locator { return this.page.getByRole('button', { name: 'Registrar Asistencia' }); }

  async navigateToRegistrar(): Promise<void> {
    await this.page.goto('/gym-admin/asistencias/registrar');
  }

  async fillRegistrarForm(miembroId: string): Promise<void> {
    await this.page.locator('[formControlName="miembroId"]').fill(miembroId);
  }

  async submitRegistrar(): Promise<void> {
    await this.page.getByRole('button', { name: 'Registrar Ingreso' }).click();
  }
}
