import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { AuditoriaService } from '../../services/auditoria.service';
import { AuditLog, labelAccion } from '../../models/audit-log.model';

@Component({
  selector: 'app-auditoria-listado',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatChipsModule, MatButtonModule,
    LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent,
  ],
  template: `
    <div class="page-header">
      <div>
        <h1>Auditoría</h1>
        <p class="page-subtitle">Actividad registrada en toda la plataforma</p>
      </div>
    </div>

    <div class="table-toolbar audit-toolbar">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar acción o entidad</mat-label>
        <input matInput [(ngModel)]="filtroAccion" (keyup.enter)="buscar()" placeholder="Ej: Login, Asistencia">
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>
      <button mat-stroked-button color="primary" (click)="buscar()">
        <mat-icon>filter_list</mat-icon>
        Filtrar
      </button>
      <button mat-button (click)="limpiar()" *ngIf="filtroAccion">Limpiar</button>
    </div>

    <app-loading-spinner *ngIf="loading" text="Cargando auditoría..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && total === 0 && !error"
      message="No hay registros de auditoría" submessage="Las acciones importantes aparecerán aquí" icon="history">
    </app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar auditoría" (retry)="cargar()"></app-error-state>

    <div class="table-container" *ngIf="!loading && total > 0">
      <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="fechaUtc">
          <th mat-header-cell *matHeaderCellDef>Fecha</th>
          <td mat-cell *matCellDef="let row">{{ row.fechaUtc | date:'dd/MM/yyyy HH:mm' }}</td>
        </ng-container>
        <ng-container matColumnDef="accion">
          <th mat-header-cell *matHeaderCellDef>Acción</th>
          <td mat-cell *matCellDef="let row">
            <mat-chip-set>
              <mat-chip [class]="chipClass(row.accion)">{{ label(row.accion) }}</mat-chip>
            </mat-chip-set>
          </td>
        </ng-container>
        <ng-container matColumnDef="entidad">
          <th mat-header-cell *matHeaderCellDef>Entidad</th>
          <td mat-cell *matCellDef="let row">{{ row.entidad }}</td>
        </ng-container>
        <ng-container matColumnDef="detalle">
          <th mat-header-cell *matHeaderCellDef>Detalle</th>
          <td mat-cell *matCellDef="let row">{{ row.detalle || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="administradorCorreo">
          <th mat-header-cell *matHeaderCellDef>Usuario</th>
          <td mat-cell *matCellDef="let row">{{ row.administradorCorreo || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="gimnasioNombre">
          <th mat-header-cell *matHeaderCellDef>Gimnasio</th>
          <td mat-cell *matCellDef="let row">{{ row.gimnasioNombre || 'Plataforma' }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
      </table>
      <mat-paginator
        [length]="total"
        [pageIndex]="page - 1"
        [pageSize]="pageSize"
        [pageSizeOptions]="[10, 25, 50, 100]"
        (page)="onPage($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .page-subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: 14px; }
    .audit-toolbar { margin-bottom: 16px; }
    .chip-auth { background: rgba(2, 119, 189, 0.12) !important; }
    .chip-asistencia { background: rgba(27, 94, 32, 0.12) !important; }
    .chip-config { background: rgba(245, 124, 0, 0.12) !important; }
    .chip-default { background: rgba(100, 116, 139, 0.12) !important; }
  `]
})
export class AuditoriaListadoComponent implements OnInit {
  filtroAccion = '';
  loading = false;
  error = false;
  total = 0;
  page = 1;
  pageSize = 25;
  dataSource = new MatTableDataSource<AuditLog>();
  columnas = ['fechaUtc', 'accion', 'entidad', 'detalle', 'administradorCorreo', 'gimnasioNombre'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  label = labelAccion;

  constructor(private service: AuditoriaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  buscar(): void {
    this.page = 1;
    this.cargar();
  }

  limpiar(): void {
    this.filtroAccion = '';
    this.page = 1;
    this.cargar();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.cargar();
  }

  chipClass(accion: string): string {
    if (accion.startsWith('Auth.')) return 'chip-auth';
    if (accion.startsWith('Asistencia.')) return 'chip-asistencia';
    if (accion.startsWith('Configuracion.')) return 'chip-config';
    return 'chip-default';
  }

  cargar(): void {
    this.loading = true;
    this.error = false;
    this.service.listar({
      accion: this.filtroAccion.trim() || undefined,
      page: this.page,
      pageSize: this.pageSize,
    }).subscribe({
      next: (result) => {
        this.dataSource.data = result.items;
        this.total = result.total;
        this.page = result.page;
        this.pageSize = result.pageSize;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }
}
