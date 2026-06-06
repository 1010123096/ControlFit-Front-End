import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GimnasiosService } from '../../services/gimnasio.service';

@Component({
  selector: 'app-crear-gimnasio-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Nuevo Gimnasio</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="dialog-field"><mat-label>Nombre *</mat-label><input matInput formControlName="nombre" cdkFocusInitial></mat-form-field>
        <mat-form-field appearance="outline" class="dialog-field"><mat-label>Dirección *</mat-label><input matInput formControlName="direccion"></mat-form-field>
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
export class CrearGimnasioDialogComponent {
  form;
  constructor(private fb: FormBuilder, private service: GimnasiosService, private dialogRef: MatDialogRef<CrearGimnasioDialogComponent>) {
    this.form = this.fb.group({ nombre: ['', Validators.required], direccion: ['', Validators.required], telefono: ['', Validators.required] });
  }
  guardar(): void { if (this.form.invalid) return; this.service.crear(this.form.getRawValue()).subscribe({ next: () => this.dialogRef.close(true) }); }
}
