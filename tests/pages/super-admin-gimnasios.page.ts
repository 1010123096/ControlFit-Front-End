import { Page, Locator } from '@playwright/test';

export class SuperAdminGimnasiosPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/super-admin/gimnasios');
  }

  get loadingSpinner(): Locator { return this.page.locator('app-loading-spinner'); }
  get emptyState(): Locator { return this.page.locator('app-empty-state'); }
  get errorState(): Locator { return this.page.locator('app-error-state'); }
  get table(): Locator { return this.page.locator('table'); }
  get nuevoButton(): Locator { return this.page.getByRole('button', { name: 'Nuevo Gimnasio' }); }

  async abrirCrearDialog(): Promise<void> {
    await this.nuevoButton.click();
  }

  async fillGimnasioForm(nombre: string, direccion: string, telefono: string): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    await dialog.locator('[formControlName="nombre"]').fill(nombre);
    await dialog.locator('[formControlName="direccion"]').fill(direccion);
    await dialog.locator('[formControlName="telefono"]').fill(telefono);
  }

  async guardarDialog(): Promise<void> {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  }

  get firstEditButton(): Locator { return this.page.locator('[matTooltip="Editar"]').first(); }
  get firstDeleteButton(): Locator { return this.page.locator('[matTooltip="Eliminar"]').first(); }
}
