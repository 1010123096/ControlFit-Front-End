import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AsistenciaService } from '../../services/asistencia.service';

@Component({
  selector: 'app-registrar-asistencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header><mat-card-title>Registrar Asistencia</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>ID del Miembro</mat-label>
              <input matInput type="number" formControlName="miembroId">
              <mat-error *ngIf="form.get('miembroId')?.hasError('required')">Requerido</mat-error>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid" class="full-width">Registrar Ingreso</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.container { max-width: 500px; margin: 0 auto; } .full-width { width: 100%; }`]
})
export class RegistrarComponent {
  form;
  constructor(private fb: FormBuilder, private service: AsistenciaService, private router: Router) {
    this.form = this.fb.group({ miembroId: [0, Validators.required] });
  }
  onSubmit(): void {
    if (this.form.invalid) return;
    this.service.registrar(this.form.value).subscribe({ next: () => this.router.navigate(['/gym-admin/asistencias']) });
  }
}
