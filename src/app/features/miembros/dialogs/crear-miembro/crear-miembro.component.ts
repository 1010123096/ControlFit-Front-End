import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MiembrosService } from '../../services/miembro.service';
import { JwtDecodedService } from '../../../../core/services/jwt-decoded.service';

@Component({
  selector: 'app-crear-miembro-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Nuevo Miembro</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="dialog-field"><mat-label>Nombre Completo *</mat-label><input matInput formControlName="nombreCompleto" cdkFocusInitial></mat-form-field>
        <mat-form-field appearance="outline" class="dialog-field"><mat-label>Correo *</mat-label><input matInput formControlName="correo" type="email"></mat-form-field>
        <mat-form-field appearance="outline" class="dialog-field"><mat-label>Teléfono *</mat-label><input matInput formControlName="telefono"></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="form.invalid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: ['']
})
export class CrearMiembroDialogComponent {
  form;
  constructor(
    private fb: FormBuilder, private service: MiembrosService,
    private jwtDecodedService: JwtDecodedService,
    private dialogRef: MatDialogRef<CrearMiembroDialogComponent>
  ) {
    this.form = this.fb.group({ nombreCompleto: ['', Validators.required], correo: ['', [Validators.required, Validators.email]], telefono: ['', Validators.required] });
  }
  guardar(): void {
    if (this.form.invalid) return;
    this.service.crear({ ...this.form.getRawValue(), gimnasioId: this.jwtDecodedService.getGimnasioId() } as any).subscribe({ next: () => this.dialogRef.close(true) });
  }
}
