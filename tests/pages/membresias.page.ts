import { Page, Locator } from '@playwright/test';

export class MembresiasPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/gym-admin/membresias');
  }

  get loadingSpinner(): Locator { return this.page.locator('app-loading-spinner'); }
  get emptyState(): Locator { return this.page.locator('app-empty-state'); }
  get errorState(): Locator { return this.page.locator('app-error-state'); }
  get table(): Locator { return this.page.locator('table'); }
  get nuevaButton(): Locator { return this.page.getByRole('button', { name: 'Nueva Membresía' }); }

  async abrirCrearDialog(): Promise<void> {
    await this.nuevaButton.click();
  }

  async fillMembresiaForm(nombre: string, duracion: string, precio: string): Promise<void> {
    const dialog = this.page.getByRole('dialog');
    await dialog.locator('[formControlName="nombre"]').fill(nombre);
    await dialog.locator('[formControlName="duracionDias"]').fill(duracion);
    await dialog.locator('[formControlName="precio"]').fill(precio);
  }

  async guardarDialog(): Promise<void> {
    await this.page.getByRole('dialog').getByRole('button', { name: 'Guardar' }).click();
  }
}
