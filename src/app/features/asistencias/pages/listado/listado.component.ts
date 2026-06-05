import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AsistenciasService } from '../../services/asistencia.service';
import { Asistencia } from '../../models/asistencia.model';

@Component({
  selector: 'app-asistencias-listado-legacy',
  standalone: true,
  imports: [CommonModule, MatTableModule, LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <h1>Asistencias (Legacy)</h1>
    <app-loading-spinner *ngIf="loading" text="Cargando..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && asistencias.length === 0 && !error" message="No hay asistencias" icon="how_to_reg"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar" (retry)="cargarAsistencias()"></app-error-state>
    <table mat-table [dataSource]="asistencias" *ngIf="!loading && asistencias.length > 0" class="full-width">
      <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let a">{{ a.id }}</td></ng-container>
      <ng-container matColumnDef="miembroId"><th mat-header-cell *matHeaderCellDef>Miembro ID</th><td mat-cell *matCellDef="let a">{{ a.miembroId }}</td></ng-container>
      <ng-container matColumnDef="fechaHora"><th mat-header-cell *matHeaderCellDef>Fecha/Hora</th><td mat-cell *matCellDef="let a">{{ a.fechaHora | date:'short' }}</td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class AsistenciasListadoLegacyComponent implements OnInit {
  asistencias: Asistencia[] = [];
  columnas = ['id', 'miembroId', 'fechaHora'];
  loading = false; error = false;
  constructor(private service: AsistenciasService) {}
  ngOnInit(): void { this.cargarAsistencias(); }
  cargarAsistencias(): void { this.loading = true; this.error = false; this.service.obtenerTodas().subscribe({ next: (d) => { this.asistencias = d; this.loading = false; }, error: () => { this.loading = false; this.error = true; } }); }
}
