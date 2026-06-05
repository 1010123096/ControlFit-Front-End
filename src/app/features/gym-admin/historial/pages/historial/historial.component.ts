import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { HistorialService } from '../../services/historial.service';
import { Historial } from '../../models/historial.model';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, MatTableModule, LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <h1>Historial</h1>
    <app-loading-spinner *ngIf="loading" text="Cargando historial..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && historial.length === 0 && !error" message="No hay registros en el historial" icon="history"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar historial" (retry)="cargarHistorial()"></app-error-state>
    <table mat-table [dataSource]="historial" *ngIf="!loading && historial.length > 0" class="full-width">
      <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let h">{{ h.id }}</td></ng-container>
      <ng-container matColumnDef="accion"><th mat-header-cell *matHeaderCellDef>Acción</th><td mat-cell *matCellDef="let h">{{ h.accion }}</td></ng-container>
      <ng-container matColumnDef="fecha"><th mat-header-cell *matHeaderCellDef>Fecha</th><td mat-cell *matCellDef="let h">{{ h.fecha | date:'short' }}</td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class HistorialComponent implements OnInit {
  historial: Historial[] = [];
  columnas = ['id', 'accion', 'fecha'];
  loading = false; error = false;
  constructor(private service: HistorialService) {}
  ngOnInit(): void { this.cargarHistorial(); }
  cargarHistorial(): void { this.loading = true; this.error = false; this.service.obtenerTodos().subscribe({ next: (d) => { this.historial = d; this.loading = false; }, error: () => { this.loading = false; this.error = true; } }); }
}
