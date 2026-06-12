import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { ChartComponent } from '../../../../../shared/components/chart/chart.component';
import { DashboardService } from '../../services/dashboard.service';
import { MiembroService } from '../../../miembros/services/miembro.service';
import { Miembro } from '../../../miembros/models/miembro.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatIconModule, MatTableModule, MatButtonModule,
    LoadingSpinnerComponent, ErrorStateComponent, ChartComponent,
  ],
  template: `
    <div class="page-header">
      <div>
        <h1>Panel de Administración</h1>
        <p class="page-subtitle">Resumen operativo de tu gimnasio</p>
      </div>
      <button mat-stroked-button color="primary" routerLink="/gym-admin/asistencias/registrar">
        <mat-icon>how_to_reg</mat-icon>
        Registrar asistencia
      </button>
    </div>

    <app-loading-spinner *ngIf="loading" text="Cargando dashboard..."></app-loading-spinner>
    <app-error-state *ngIf="error" message="Error al cargar dashboard" (retry)="cargarStats()"></app-error-state>

    <div class="stats-grid" *ngIf="!loading && !error">
      <mat-card class="stat-card stat-primary">
        <mat-card-content>
          <mat-icon class="stat-icon">people</mat-icon>
          <div class="stat-value">{{ stats.totalMiembros }}</div>
          <div class="stat-label">Total Miembros</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card stat-success">
        <mat-card-content>
          <mat-icon class="stat-icon">check_circle</mat-icon>
          <div class="stat-value">{{ stats.miembrosActivos }}</div>
          <div class="stat-label">Miembros Activos</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card stat-warning">
        <mat-card-content>
          <mat-icon class="stat-icon">warning</mat-icon>
          <div class="stat-value">{{ stats.membresiasVencidas }}</div>
          <div class="stat-label">Membresías Vencidas</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card stat-info">
        <mat-card-content>
          <mat-icon class="stat-icon">how_to_reg</mat-icon>
          <div class="stat-value">{{ stats.asistenciasHoy }}</div>
          <div class="stat-label">Asistencias Hoy</div>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="dashboard-grid" *ngIf="!loading && !error">
      <mat-card class="dashboard-card">
        <mat-card-header><mat-card-title>Asistencias — últimos 7 días</mat-card-title></mat-card-header>
        <mat-card-content class="chart-wrap">
          <app-chart type="bar" [labels]="chartLabels" [datasets]="chartDatasets" ariaLabel="Gráfico de asistencias de los últimos 7 días"></app-chart>
        </mat-card-content>
      </mat-card>
      <mat-card class="dashboard-card">
        <mat-card-header><mat-card-title>Miembros Recientes</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="recentMembers" class="recent-table">
            <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let m">{{ m.nombreCompleto }}</td></ng-container>
            <ng-container matColumnDef="correo"><th mat-header-cell *matHeaderCellDef>Correo</th><td mat-cell *matCellDef="let m">{{ m.correo }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="['nombre','correo']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['nombre','correo'];"></tr>
            <tr *ngIf="recentMembers.length === 0"><td colspan="2" class="empty-cell">Sin miembros recientes</td></tr>
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
    .stat-warning { border-top: 4px solid var(--color-warning); }
    .stat-warning .stat-icon, .stat-warning .stat-value { color: var(--color-warning); }
    .stat-info { border-top: 4px solid var(--color-info); }
    .stat-info .stat-icon, .stat-info .stat-value { color: var(--color-info); }
    .chart-wrap { height: 260px; }
    .recent-table { width: 100%; }
    .empty-cell { text-align: center; color: var(--text-muted); padding: 24px !important; }
  `]
})
export class DashboardComponent implements OnInit {
  stats = { totalMiembros: 0, miembrosActivos: 0, membresiasVencidas: 0, asistenciasHoy: 0 };
  loading = true;
  error = false;
  recentMembers: Miembro[] = [];
  chartLabels: string[] = [];
  chartDatasets = [{ label: 'Asistencias', data: [] as number[], backgroundColor: '#1B5E20' }];

  constructor(
    private dashboardService: DashboardService,
    private miembroService: MiembroService
  ) {}

  ngOnInit(): void {
    this.chartLabels = this.buildLast7DayLabels();
    this.cargarStats();
    this.cargarMiembrosRecientes();
  }

  cargarStats(): void {
    this.loading = true;
    this.error = false;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        const weekly = data.asistenciasSemanales ?? [0, 0, 0, 0, 0, 0, 0];
        this.chartDatasets = [{ label: 'Asistencias', data: weekly, backgroundColor: '#1B5E20' }];
        this.loading = false;
      },
      error: () => { this.loading = false; this.error = true; },
    });
  }

  cargarMiembrosRecientes(): void {
    this.miembroService.obtenerTodos().subscribe({
      next: (data) => { this.recentMembers = data.slice(0, 5); },
    });
  }

  private buildLast7DayLabels(): string[] {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(days[d.getDay()]);
    }
    return labels;
  }
}
