import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly correoInput: Locator;
  readonly contrasenaInput: Locator;
  readonly ingresarButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.correoInput = page.locator('[formControlName="correo"]');
    this.contrasenaInput = page.locator('[formControlName="contrasena"]');
    this.ingresarButton = page.getByRole('button', { name: 'Ingresar' });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/');
  }

  async login(correo: string, contrasena: string): Promise<void> {
    await this.correoInput.fill(correo);
    await this.contrasenaInput.fill(contrasena);
    await this.ingresarButton.click();
  }
}
