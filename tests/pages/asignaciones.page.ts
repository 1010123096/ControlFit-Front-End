import { Page, Locator } from '@playwright/test';

export class AsignacionesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/gym-admin/asignaciones');
  }

  get loadingSpinner(): Locator { return this.page.locator('app-loading-spinner'); }
  get emptyState(): Locator { return this.page.locator('app-empty-state'); }
  get errorState(): Locator { return this.page.locator('app-error-state'); }
  get table(): Locator { return this.page.locator('table'); }
  get nuevaButton(): Locator { return this.page.getByRole('button', { name: 'Nueva Asignación' }); }

  async abrirCrearDialog(): Promise<void> {
    await this.nuevaButton.click();
  }

  async fillAsignacionForm(miembroId: string, membresiaId: string): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    await dialog.locator('[formControlName="miembroId"]').fill(miembroId);
    await dialog.locator('[formControlName="membresiaId"]').fill(membresiaId);
  }

  async guardarDialog(): Promise<void> {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  }
}
