import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { GimnasiosService } from '../../services/gimnasio.service';
import { Gimnasio } from '../../models/gimnasio.model';

@Component({
  selector: 'app-gimnasios-legacy',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <h1>Gimnasios (Legacy)</h1>
    <app-loading-spinner *ngIf="loading" text="Cargando..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && gimnasios.length === 0 && !error" message="No hay gimnasios" icon="business"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar" (retry)="cargarGimnasios()"></app-error-state>
    <table mat-table [dataSource]="gimnasios" *ngIf="!loading && gimnasios.length > 0" class="full-width">
      <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let g">{{ g.nombre }}</td></ng-container>
      <ng-container matColumnDef="direccion"><th mat-header-cell *matHeaderCellDef>Dirección</th><td mat-cell *matCellDef="let g">{{ g.direccion }}</td></ng-container>
      <ng-container matColumnDef="telefono"><th mat-header-cell *matHeaderCellDef>Teléfono</th><td mat-cell *matCellDef="let g">{{ g.telefono }}</td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class GimnasiosLegacyComponent implements OnInit {
  gimnasios: Gimnasio[] = [];
  columnas = ['nombre', 'direccion', 'telefono'];
  loading = false; error = false;
  constructor(private service: GimnasiosService) {}
  ngOnInit(): void { this.cargarGimnasios(); }
  cargarGimnasios(): void { this.loading = true; this.error = false; this.service.obtenerTodos().subscribe({ next: (d) => { this.gimnasios = d; this.loading = false; }, error: () => { this.loading = false; this.error = true; } }); }
}
