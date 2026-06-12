import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { ConfiguracionService } from '../../services/configuracion.service';
import { NotificationService } from '../../../../../shared/services/notification.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
    LoadingSpinnerComponent, ErrorStateComponent,
  ],
  template: `
    <div class="page-header">
      <div>
        <h1>Configuración del Sistema</h1>
        <p class="page-subtitle">Parámetros globales de la plataforma CossGym</p>
      </div>
    </div>

    <app-loading-spinner *ngIf="loading" text="Cargando configuración..."></app-loading-spinner>
    <app-error-state *ngIf="error" message="No se pudo cargar la configuración" (retry)="cargar()"></app-error-state>

    <mat-card *ngIf="!loading && !error" class="config-card">
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <mat-form-field appearance="outline" class="dialog-field">
            <mat-label>Nombre del sistema *</mat-label>
            <input matInput formControlName="nombreSistema">
            <mat-icon matPrefix aria-hidden="true">business</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="dialog-field">
            <mat-label>Correo de contacto *</mat-label>
            <input matInput formControlName="correoContacto" type="email">
            <mat-icon matPrefix aria-hidden="true">email</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="dialog-field">
            <mat-label>Teléfono de contacto *</mat-label>
            <input matInput formControlName="telefonoContacto">
            <mat-icon matPrefix aria-hidden="true">phone</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: 14px; }
    .config-card { max-width: 560px; border-radius: 12px; }
    mat-card-content { padding: 24px; display: flex; flex-direction: column; gap: 8px; }
  `]
})
export class ConfiguracionComponent implements OnInit {
  form;
  loading = false;
  saving = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private service: ConfiguracionService,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      nombreSistema: ['', Validators.required],
      correoContacto: ['', [Validators.required, Validators.email]],
      telefonoContacto: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.error = false;
    this.service.obtener().subscribe({
      next: (d) => {
        this.form.patchValue(d);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.service.actualizar({
      nombreSistema: this.form.value.nombreSistema!,
      correoContacto: this.form.value.correoContacto!,
      telefonoContacto: this.form.value.telefonoContacto!,
    }).subscribe({
      next: () => {
        this.saving = false;
        this.notification.showSuccess('Configuración guardada correctamente');
      },
      error: () => {
        this.saving = false;
      },
    });
  }
}
