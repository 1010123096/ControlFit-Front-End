import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GimnasioService } from '../../services/gimnasio.service';
import { Gimnasio } from '../../models/gimnasio.model';

@Component({
  selector: 'app-gimnasio-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Gimnasio' : 'Nuevo Gimnasio' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Nombre</mat-label><input matInput formControlName="nombre"><mat-error *ngIf="form.get('nombre')?.hasError('required')">Requerido</mat-error></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Dirección</mat-label><input matInput formControlName="direccion"><mat-error *ngIf="form.get('direccion')?.hasError('required')">Requerido</mat-error></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Teléfono</mat-label><input matInput formControlName="telefono"><mat-error *ngIf="form.get('telefono')?.hasError('required')">Requerido</mat-error></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="form.invalid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; }`]
})
export class GimnasioDialogComponent implements OnInit {
  form;
  constructor(
    private fb: FormBuilder, private service: GimnasioService,
    private dialogRef: MatDialogRef<GimnasioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Gimnasio | null
  ) {
    this.form = this.fb.group({ nombre: ['', Validators.required], direccion: ['', Validators.required], telefono: ['', Validators.required] });
  }
  ngOnInit(): void { if (this.data) this.form.patchValue(this.data); }
  guardar(): void {
    if (this.form.invalid) return;
    if (this.data) { this.service.actualizar({ id: this.data.id, ...this.form.getRawValue() } as any).subscribe({ next: () => this.dialogRef.close(true) }); }
    else { this.service.crear(this.form.getRawValue() as any).subscribe({ next: () => this.dialogRef.close(true) }); }
  }
}
