import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { SuperAdminDashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, LoadingSpinnerComponent, ErrorStateComponent],
  template: `
    <h1>Panel de Super Administrador</h1>
    <div class="stats-grid">
      <mat-card>
        <mat-card-content>
          <mat-icon>business</mat-icon>
          <div class="stat-value">{{ stats.totalGimnasios }}</div>
          <div class="stat-label">Total Gimnasios</div>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <mat-icon>people</mat-icon>
          <div class="stat-value">{{ stats.totalMiembros }}</div>
          <div class="stat-label">Total Miembros</div>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <mat-icon>admin_panel_settings</mat-icon>
          <div class="stat-value">{{ stats.totalAdministradores }}</div>
          <div class="stat-label">Administradores</div>
        </mat-card-content>
      </mat-card>
    </div>
    <app-loading-spinner *ngIf="loading" text="Cargando dashboard..."></app-loading-spinner>
    <app-error-state *ngIf="error" message="Error al cargar dashboard" (retry)="cargarStats()"></app-error-state>
  `,
  styles: [`
    h1 { margin-bottom: 24px; font-weight: 500; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    mat-card { cursor: pointer; transition: transform 0.2s; }
    mat-card:hover { transform: translateY(-2px); }
    mat-card-content { text-align: center; padding: 24px; }
    mat-icon { font-size: 48px; height: 48px; width: 48px; color: #3f51b5; margin-bottom: 8px; }
    .stat-value { font-size: 32px; font-weight: 500; margin: 8px 0; }
    .stat-label { color: rgba(0,0,0,0.54); font-size: 14px; }
  `]
})
export class SuperAdminDashboardComponent implements OnInit {
  stats = { totalGimnasios: 0, totalMiembros: 0, totalAdministradores: 0 };
  loading = true;
  error = false;

  constructor(private dashboardService: SuperAdminDashboardService) {}

  ngOnInit(): void { this.cargarStats(); }

  cargarStats(): void {
    this.loading = true;
    this.error = false;
    this.dashboardService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; this.error = true; },
    });
  }
}
