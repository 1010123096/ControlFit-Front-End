import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { ChartComponent } from '../../../../../shared/components/chart/chart.component';
import { SuperAdminDashboardService } from '../../services/dashboard.service';
import { GimnasioService } from '../../../../super-admin/gimnasios/services/gimnasio.service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatTableModule,
    LoadingSpinnerComponent, ErrorStateComponent, ChartComponent,
  ],
  template: `
    <div class="page-header">
      <div>
        <h1>Panel de Plataforma</h1>
        <p class="page-subtitle">Vista global de gimnasios y operación CossGym</p>
      </div>
    </div>

    <app-loading-spinner *ngIf="loading" text="Cargando dashboard..."></app-loading-spinner>
    <app-error-state *ngIf="error" message="Error al cargar dashboard" (retry)="cargarStats()"></app-error-state>

    <div class="stats-grid" *ngIf="!loading && !error">
      <mat-card class="stat-card stat-primary">
        <mat-card-content>
          <mat-icon class="stat-icon">business</mat-icon>
          <div class="stat-value">{{ stats.totalGimnasios }}</div>
          <div class="stat-label">Gimnasios</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card stat-success">
        <mat-card-content>
          <mat-icon class="stat-icon">people</mat-icon>
          <div class="stat-value">{{ stats.totalMiembros }}</div>
          <div class="stat-label">Miembros totales</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card stat-info">
        <mat-card-content>
          <mat-icon class="stat-icon">admin_panel_settings</mat-icon>
          <div class="stat-value">{{ stats.totalAdministradores }}</div>
          <div class="stat-label">Administradores</div>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="dashboard-grid" *ngIf="!loading && !error">
      <mat-card class="dashboard-card">
        <mat-card-header><mat-card-title>Distribución de gimnasios</mat-card-title></mat-card-header>
        <mat-card-content class="chart-wrap">
          <app-chart type="doughnut" [labels]="chartLabels" [datasets]="chartDatasets"></app-chart>
        </mat-card-content>
      </mat-card>
      <mat-card class="dashboard-card">
        <mat-card-header><mat-card-title>Gimnasios registrados</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="gimnasios" class="recent-table">
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let g">{{ g.nombre }}</td>
            </ng-container>
            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let g">{{ g.estado ? 'Activo' : 'Inactivo' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['nombre','estado']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['nombre','estado'];"></tr>
            <tr *ngIf="gimnasios.length === 0">
              <td colspan="2" class="empty-cell">Sin gimnasios registrados</td>
            </tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stat-primary { border-top: 4px solid var(--brand-primary); }
    .stat-primary .stat-icon, .stat-primary .stat-value { color: var(--brand-primary); }
    .stat-success { border-top: 4px solid var(--color-success); }
    .stat-success .stat-icon, .stat-success .stat-value { color: var(--color-success); }
    .stat-info { border-top: 4px solid var(--color-info); }
    .stat-info .stat-icon, .stat-info .stat-value { color: var(--color-info); }
    .chart-wrap { height: 260px; }
    .recent-table { width: 100%; }
    .empty-cell { text-align: center; color: var(--text-muted); padding: 24px !important; }
  `]
})
export class SuperAdminDashboardComponent implements OnInit {
  stats = { totalGimnasios: 0, totalMiembros: 0, totalAdministradores: 0 };
  gimnasios: any[] = [];
  loading = true;
  error = false;
  chartLabels: string[] = [];
  chartDatasets: any[] = [{
    label: 'Gimnasios',
    data: [] as number[],
    backgroundColor: ['#1B5E20', '#2E7D32', '#43A047', '#66BB6A', '#FF6F00'],
  }];

  constructor(
    private dashboardService: SuperAdminDashboardService,
    private gimnasioService: GimnasioService
  ) {}

  ngOnInit(): void {
    this.cargarStats();
    this.cargarGimnasios();
  }

  cargarStats(): void {
    this.loading = true;
    this.error = false;
    this.dashboardService.getStats().subscribe({
      next: (data: any) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; this.error = true; },
    });
  }

  cargarGimnasios(): void {
    this.gimnasioService.obtenerTodos().subscribe({
      next: (data: any[]) => {
        this.gimnasios = data;
        this.chartLabels = data.map((g: any) => g.nombre);
        this.chartDatasets = [{
          label: 'Gimnasios',
          data: data.map(() => 1),
          backgroundColor: ['#1B5E20', '#2E7D32', '#43A047', '#66BB6A', '#FF6F00'],
        }];
      },
    });
  }
}
