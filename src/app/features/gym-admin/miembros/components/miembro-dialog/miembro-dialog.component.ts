import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MiembroService } from '../../services/miembro.service';
import { JwtDecodedService } from '../../../../../core/services/jwt-decoded.service';
import { Miembro, CrearMiembro, ActualizarMiembro } from '../../models/miembro.model';

@Component({
  selector: 'app-miembro-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Miembro' : 'Nuevo Miembro' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="miembroForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre Completo</mat-label>
          <input matInput formControlName="nombreCompleto">
          <mat-error *ngIf="miembroForm.get('nombreCompleto')?.hasError('required')">Requerido</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Correo</mat-label>
          <input matInput formControlName="correo" type="email">
          <mat-error *ngIf="miembroForm.get('correo')?.hasError('required')">Requerido</mat-error>
          <mat-error *ngIf="miembroForm.get('correo')?.hasError('email')">Email inválido</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono">
          <mat-error *ngIf="miembroForm.get('telefono')?.hasError('required')">Requerido</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="miembroForm.invalid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class MiembroDialogComponent implements OnInit {
  miembroForm;

  constructor(
    private fb: FormBuilder,
    private miembroService: MiembroService,
    private jwtDecodedService: JwtDecodedService,
    private dialogRef: MatDialogRef<MiembroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Miembro | null
  ) {
    this.miembroForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.miembroForm.patchValue({
        nombreCompleto: this.data.nombreCompleto,
        correo: this.data.correo,
        telefono: this.data.telefono,
      });
    }
  }

  guardar(): void {
    if (this.miembroForm.invalid) return;
    const payload = this.miembroForm.value;
    if (this.data) {
      const miembro: ActualizarMiembro = { id: this.data.id, ...payload } as ActualizarMiembro;
      this.miembroService.actualizar(miembro).subscribe({ next: () => this.dialogRef.close(true) });
    } else {
      const miembro: CrearMiembro = { ...payload, gimnasioId: this.jwtDecodedService.getGimnasioId() } as CrearMiembro;
      this.miembroService.crear(miembro).subscribe({ next: () => this.dialogRef.close(true) });
    }
  }
}
