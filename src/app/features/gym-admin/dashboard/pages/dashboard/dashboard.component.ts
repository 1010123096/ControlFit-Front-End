import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { ChartComponent } from '../../../../../shared/components/chart/chart.component';
import { DashboardService } from '../../services/dashboard.service';
import { MiembroService } from '../../../miembros/services/miembro.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatTableModule, MatButtonModule,
    LoadingSpinnerComponent, ErrorStateComponent, ChartComponent,
  ],
  template: `
    <h1 style="margin:0 0 24px;font-weight:500;color:#0f172a;">Panel de Administración</h1>

    <app-loading-spinner *ngIf="loading" text="Cargando dashboard..."></app-loading-spinner>
    <app-error-state *ngIf="error" message="Error al cargar dashboard" (retry)="cargarStats()"></app-error-state>

    <div class="stats-grid" *ngIf="!loading">
      <mat-card class="stat-card" style="border-top:4px solid #3f51b5;">
        <mat-card-content>
          <mat-icon class="stat-icon" style="color:#3f51b5;">people</mat-icon>
          <div class="stat-value">{{ stats.totalMiembros }}</div>
          <div class="stat-label">Total Miembros</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card" style="border-top:4px solid #4caf50;">
        <mat-card-content>
          <mat-icon class="stat-icon" style="color:#4caf50;">check_circle</mat-icon>
          <div class="stat-value">{{ stats.miembrosActivos }}</div>
          <div class="stat-label">Miembros Activos</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card" style="border-top:4px solid #ff9800;">
        <mat-card-content>
          <mat-icon class="stat-icon" style="color:#ff9800;">warning</mat-icon>
          <div class="stat-value">{{ stats.membresiasVencidas }}</div>
          <div class="stat-label">Membresías Vencidas</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card" style="border-top:4px solid #2196f3;">
        <mat-card-content>
          <mat-icon class="stat-icon" style="color:#2196f3;">how_to_reg</mat-icon>
          <div class="stat-value">{{ stats.asistenciasHoy }}</div>
          <div class="stat-label">Asistencias Hoy</div>
        </mat-card-content>
      </mat-card>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:24px;" *ngIf="!loading">
      <mat-card style="border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:16px;">
        <mat-card-header><mat-card-title style="font-size:16px;font-weight:500;">Asistencias Semanales</mat-card-title></mat-card-header>
        <mat-card-content style="height:250px;">
          <app-chart type="bar" [labels]="chartLabels" [datasets]="chartDatasets"></app-chart>
        </mat-card-content>
      </mat-card>
      <mat-card style="border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:16px;">
        <mat-card-header><mat-card-title style="font-size:16px;font-weight:500;">Miembros Recientes</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="recentMembers" style="width:100%;">
            <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let m">{{ m.nombreCompleto }}</td></ng-container>
            <ng-container matColumnDef="correo"><th mat-header-cell *matHeaderCellDef>Correo</th><td mat-cell *matCellDef="let m">{{ m.correo }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="['nombre','correo']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['nombre','correo'];"></tr>
            <tr *ngIf="recentMembers.length === 0"><td colspan="2" style="text-align:center;color:#94a3b8;padding:24px;">Sin miembros recientes</td></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    @media (max-width: 768px) {
      div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = { totalMiembros: 0, miembrosActivos: 0, membresiasVencidas: 0, asistenciasHoy: 0 };
  loading = true;
  error = false;
  recentMembers: any[] = [];
  chartLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  chartDatasets = [{ label: 'Asistencias', data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: '#3f51b5' }];

  constructor(
    private dashboardService: DashboardService,
    private miembroService: MiembroService
  ) {}

  ngOnInit(): void {
    this.cargarStats();
    this.cargarMiembrosRecientes();
  }

  cargarStats(): void {
    this.loading = true; this.error = false;
    this.dashboardService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; this.error = true; },
    });
  }

  cargarMiembrosRecientes(): void {
    this.miembroService.obtenerTodos().subscribe({
      next: (data) => { this.recentMembers = data.slice(0, 5); },
    });
  }
}
