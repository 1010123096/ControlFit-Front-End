import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AsignacionesService } from '../../services/asignacion.service';
import { Asignacion } from '../../models/asignacion.model';
import { JwtDecodedService } from '../../../../core/services/jwt-decoded.service';

@Component({
  selector: 'app-asignaciones-legacy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <h1>Asignaciones (Legacy)</h1>
    <mat-card class="crear-card">
      <mat-card-content>
        <form [formGroup]="form">
          <mat-form-field appearance="outline" class="full-width"><mat-label>ID Miembro</mat-label><input matInput type="number" formControlName="miembroId"></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>ID Membresía</mat-label><input matInput type="number" formControlName="membresiaId"></mat-form-field>
          <button mat-raised-button color="primary" (click)="crear()" [disabled]="form.invalid">Crear Asignación</button>
        </form>
      </mat-card-content>
    </mat-card>
    <app-loading-spinner *ngIf="loading" text="Cargando..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && asignaciones.length === 0 && !error" message="No hay asignaciones" icon="assignment"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar" (retry)="cargarAsignaciones()"></app-error-state>
    <table mat-table [dataSource]="asignaciones" *ngIf="!loading && asignaciones.length > 0" class="full-width">
      <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let a">{{ a.id }}</td></ng-container>
      <ng-container matColumnDef="miembroId"><th mat-header-cell *matHeaderCellDef>Miembro ID</th><td mat-cell *matCellDef="let a">{{ a.miembroId }}</td></ng-container>
      <ng-container matColumnDef="membresiaId"><th mat-header-cell *matHeaderCellDef>Membresía ID</th><td mat-cell *matCellDef="let a">{{ a.membresiaId }}</td></ng-container>
      <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let a">{{ a.estado }}</td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.crear-card { max-width: 500px; margin-bottom: 24px; } .full-width { width: 100%; }`]
})
export class AsignacionesLegacyComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  columnas = ['id', 'miembroId', 'membresiaId', 'estado'];
  loading = false; error = false;
  form;
  constructor(private fb: FormBuilder, private service: AsignacionesService, private jwtDecodedService: JwtDecodedService) {
    this.form = this.fb.group({ miembroId: [0, Validators.required], membresiaId: [0, Validators.required] });
  }
  ngOnInit(): void { this.cargarAsignaciones(); }
  cargarAsignaciones(): void { this.loading = true; this.error = false; this.service.obtenerTodas().subscribe({ next: (d) => { this.asignaciones = d; this.loading = false; }, error: () => { this.loading = false; this.error = true; } }); }
  crear(): void { if (this.form.invalid) return; this.service.crear({ ...this.form.getRawValue(), gimnasioId: this.jwtDecodedService.getGimnasioId() }).subscribe({ next: () => { this.form.reset(); this.cargarAsignaciones(); } }); }
}
