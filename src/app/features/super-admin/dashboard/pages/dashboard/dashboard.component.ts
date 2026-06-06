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
    <h1 style="margin:0 0 24px;font-weight:500;color:#0f172a;">Panel de Super Administrador</h1>

    <app-loading-spinner *ngIf="loading" text="Cargando dashboard..."></app-loading-spinner>
    <app-error-state *ngIf="error" message="Error al cargar dashboard" (retry)="cargarStats()"></app-error-state>

    <div class="stats-grid" *ngIf="!loading">
      <mat-card class="stat-card" style="border-top:4px solid #1a237e;">
        <mat-card-content>
          <mat-icon class="stat-icon" style="color:#1a237e;">business</mat-icon>
          <div class="stat-value">{{ stats.totalGimnasios }}</div>
          <div class="stat-label">Total Gimnasios</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card" style="border-top:4px solid #3f51b5;">
        <mat-card-content>
          <mat-icon class="stat-icon" style="color:#3f51b5;">people</mat-icon>
          <div class="stat-value">{{ stats.totalMiembros }}</div>
          <div class="stat-label">Total Miembros</div>
        </mat-card-content>
      </mat-card>
      <mat-card class="stat-card" style="border-top:4px solid #7c4dff;">
        <mat-card-content>
          <mat-icon class="stat-icon" style="color:#7c4dff;">admin_panel_settings</mat-icon>
          <div class="stat-value">{{ stats.totalAdministradores }}</div>
          <div class="stat-label">Administradores</div>
        </mat-card-content>
      </mat-card>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:24px;" *ngIf="!loading">
      <mat-card style="border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:16px;">
        <mat-card-header><mat-card-title style="font-size:16px;font-weight:500;">Gimnasios Registrados</mat-card-title></mat-card-header>
        <mat-card-content style="height:250px;">
          <app-chart type="doughnut" [labels]="chartLabels" [datasets]="chartDatasets"></app-chart>
        </mat-card-content>
      </mat-card>
      <mat-card style="border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08);padding:16px;">
        <mat-card-header><mat-card-title style="font-size:16px;font-weight:500;">Gimnasios</mat-card-title></mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="gimnasios" style="width:100%;">
            <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let g">{{ g.nombre }}</td></ng-container>
            <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let g">{{ g.estado ? 'Activo' : 'Inactivo' }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="['nombre','estado']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['nombre','estado'];"></tr>
            <tr *ngIf="gimnasios.length === 0"><td colspan="2" style="text-align:center;color:#94a3b8;padding:24px;">Sin gimnasios registrados</td></tr>
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
export class SuperAdminDashboardComponent implements OnInit {
  stats = { totalGimnasios: 0, totalMiembros: 0, totalAdministradores: 0 };
  gimnasios: any[] = [];
  loading = true;
  error = false;
  chartLabels: string[] = [];
  chartDatasets: any[] = [{ label: 'Gimnasios', data: [] as number[], backgroundColor: ['#1a237e', '#3f51b5', '#7c4dff', '#7986cb', '#9fa8da'] }];

  constructor(
    private dashboardService: SuperAdminDashboardService,
    private gimnasioService: GimnasioService
  ) {}

  ngOnInit(): void {
    this.cargarStats();
    this.cargarGimnasios();
  }

  cargarStats(): void {
    this.loading = true; this.error = false;
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
          backgroundColor: ['#1a237e', '#3f51b5', '#7c4dff', '#7986cb', '#9fa8da'],
        }];
      },
    });
  }
}
