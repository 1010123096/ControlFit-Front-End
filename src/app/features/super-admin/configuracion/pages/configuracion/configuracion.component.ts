import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfiguracionService } from '../../services/configuracion.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, LoadingSpinnerComponent],
  template: `
    <h1>Configuración del Sistema</h1>
    <app-loading-spinner *ngIf="loading" text="Cargando configuración..."></app-loading-spinner>
    <mat-card *ngIf="!loading">
      <mat-card-content>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width"><mat-label>Nombre del Sistema</mat-label><input matInput formControlName="nombreSistema"></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Correo de Contacto</mat-label><input matInput formControlName="correoContacto" type="email"></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Teléfono de Contacto</mat-label><input matInput formControlName="telefonoContacto"></mat-form-field>
          <button mat-raised-button color="primary" (click)="guardar()" [disabled]="form.invalid">Guardar Cambios</button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; } mat-card { max-width: 600px; }`]
})
export class ConfiguracionComponent implements OnInit {
  form;
  loading = false;
  constructor(private fb: FormBuilder, private service: ConfiguracionService) {
    this.form = this.fb.group({ nombreSistema: ['', Validators.required], correoContacto: ['', [Validators.required, Validators.email]], telefonoContacto: ['', Validators.required] });
  }
  ngOnInit(): void { this.cargar(); }
  cargar(): void { this.loading = true; this.service.obtener().subscribe({ next: (d) => { this.form.patchValue(d); this.loading = false; }, error: () => { this.loading = false; } }); }
  guardar(): void { if (this.form.invalid) return; this.service.actualizar(this.form.getRawValue() as any).subscribe({ next: () => alert('Configuración guardada') }); }
}
