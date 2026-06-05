import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AsignacionService } from '../../services/asignacion.service';
import { JwtDecodedService } from '../../../../../core/services/jwt-decoded.service';

@Component({
  selector: 'app-asignacion-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Nueva Asignación</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width"><mat-label>ID Miembro</mat-label><input matInput type="number" formControlName="miembroId"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>ID Membresía</mat-label><input matInput type="number" formControlName="membresiaId"></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="form.invalid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class AsignacionDialogComponent {
  form;
  constructor(
    private fb: FormBuilder, private service: AsignacionService,
    private jwtDecodedService: JwtDecodedService,
    private dialogRef: MatDialogRef<AsignacionDialogComponent>
  ) {
    this.form = this.fb.group({ miembroId: [0, Validators.required], membresiaId: [0, Validators.required] });
  }
  guardar(): void {
    if (this.form.invalid) return;
    this.service.crear({ ...this.form.value, gimnasioId: this.jwtDecodedService.getGimnasioId() }).subscribe({ next: () => this.dialogRef.close(true) });
  }
}
