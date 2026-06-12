import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { AsistenciaService } from '../../services/asistencia.service';
import { Asistencia } from '../../models/asistencia.model';

@Component({
  selector: 'app-listado-asistencias',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule,
    MatPaginatorModule, MatSortModule, MatChipsModule,
    LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent,
  ],
  template: `
    <div class="page-header">
      <div>
        <h1>Asistencias</h1>
        <p class="page-subtitle">Historial de ingresos al gimnasio</p>
      </div>
      <button mat-raised-button color="primary" routerLink="registrar">
        <mat-icon>add</mat-icon> Registrar Asistencia
      </button>
    </div>
    <app-loading-spinner *ngIf="loading" text="Cargando asistencias..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && asistencias.length === 0 && !error"
      message="No hay asistencias registradas" submessage="Registre un ingreso para comenzar" icon="how_to_reg">
    </app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar asistencias" (retry)="cargarAsistencias()"></app-error-state>
    <div class="table-container" *ngIf="!loading && asistencias.length > 0">
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="nombreMiembro">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Miembro</th>
          <td mat-cell *matCellDef="let a">{{ a.nombreMiembro || ('#' + a.miembroId) }}</td>
        </ng-container>
        <ng-container matColumnDef="fechaHoraAcceso">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha/Hora</th>
          <td mat-cell *matCellDef="let a">{{ a.fechaHoraAcceso | date:'dd/MM/yyyy HH:mm' }}</td>
        </ng-container>
        <ng-container matColumnDef="fuente">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Fuente</th>
          <td mat-cell *matCellDef="let a">
            <mat-chip-set>
              <mat-chip [class.chip-bio]="a.fuente === 'Biometrica'">
                <mat-icon matChipAvatar aria-hidden="true">{{ a.fuente === 'Biometrica' ? 'fingerprint' : 'touch_app' }}</mat-icon>
                {{ a.fuente === 'Biometrica' ? 'Huella' : 'Manual' }}
              </mat-chip>
            </mat-chip-set>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: [`
    .chip-bio { background: rgba(25, 118, 210, 0.12) !important; }
  `]
})
export class ListadoComponent implements OnInit {
  asistencias: Asistencia[] = [];
  columnas = ['nombreMiembro', 'fechaHoraAcceso', 'fuente'];
  loading = false;
  error = false;
  dataSource = new MatTableDataSource<Asistencia>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: AsistenciaService) {}

  ngOnInit(): void { this.cargarAsistencias(); }

  cargarAsistencias(): void {
    this.loading = true;
    this.error = false;
    this.service.obtenerTodas().subscribe({
      next: (d) => {
        this.asistencias = d;
        this.dataSource.data = d;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }
}
