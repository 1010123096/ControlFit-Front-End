import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MembresiaService } from '../../services/membresia.service';
import { JwtDecodedService } from '../../../../../core/services/jwt-decoded.service';
import { Membresia } from '../../models/membresia.model';

@Component({
  selector: 'app-membresia-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Membresía' : 'Nueva Membresía' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Nombre</mat-label><input matInput formControlName="nombre"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Duración (días)</mat-label><input matInput type="number" formControlName="duracionDias"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Precio</mat-label><input matInput type="number" formControlName="precio"></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="form.invalid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class MembresiaDialogComponent implements OnInit {
  form;
  constructor(
    private fb: FormBuilder, private service: MembresiaService,
    private jwtDecodedService: JwtDecodedService,
    private dialogRef: MatDialogRef<MembresiaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Membresia | null
  ) {
    this.form = this.fb.group({ nombre: ['', Validators.required], duracionDias: [0, Validators.required], precio: [0, Validators.required] });
  }
  ngOnInit(): void { if (this.data) this.form.patchValue({ ...this.data }); }
  guardar(): void {
    if (this.form.invalid) return;
    if (this.data) { this.service.actualizar(this.data.id, this.form.getRawValue() as Partial<Membresia>).subscribe({ next: () => this.dialogRef.close(true) }); }
    else { this.service.crear({ ...this.form.getRawValue(), gimnasioId: this.jwtDecodedService.getGimnasioId() } as any).subscribe({ next: () => this.dialogRef.close(true) }); }
  }
}
