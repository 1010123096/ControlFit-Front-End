import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { AsistenciasService } from '../../services/asistencia.service';
import { Asistencia } from '../../models/asistencia.model';

@Component({
  selector: 'app-filtrar-asistencias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatCardModule],
  template: `
    <h1>Filtrar Asistencias</h1>
    <mat-card>
      <mat-card-content>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width"><mat-label>ID del Miembro</mat-label><input matInput type="number" formControlName="miembroId"></mat-form-field>
          <button mat-raised-button color="primary" (click)="filtrar()" [disabled]="form.invalid">Buscar</button>
        </form>
      </mat-card-content>
    </mat-card>
    <table mat-table [dataSource]="resultados" class="full-width" *ngIf="resultados.length > 0">
      <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let a">{{ a.id }}</td></ng-container>
      <ng-container matColumnDef="fechaHora"><th mat-header-cell *matHeaderCellDef>Fecha/Hora</th><td mat-cell *matCellDef="let a">{{ a.fechaHora | date:'short' }}</td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.full-width { width: 100%; margin-bottom: 12px; } mat-card { max-width: 500px; margin-bottom: 24px; }`]
})
export class FiltrarComponent {
  form;
  resultados: Asistencia[] = [];
  columnas = ['id', 'fechaHora'];
  constructor(private fb: FormBuilder, private service: AsistenciasService) {
    this.form = this.fb.group({ miembroId: [0, Validators.required] });
  }
  filtrar(): void {
    if (this.form.invalid) return;
    this.service.obtenerTodas().subscribe({ next: (d) => { this.resultados = d.filter(a => a.miembroId === Number(this.form.getRawValue().miembroId)); } });
  }
}
