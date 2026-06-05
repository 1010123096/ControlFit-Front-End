import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { AsignacionService } from '../../services/asignacion.service';
import { Asignacion } from '../../models/asignacion.model';
import { AsignacionDialogComponent } from '../../components/asignacion-dialog/asignacion-dialog.component';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule,
    LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent,
  ],
  template: `
    <div class="header"><h1>Asignaciones</h1><button mat-raised-button color="primary" (click)="abrirCrearDialog()"><mat-icon>add</mat-icon> Nueva Asignación</button></div>
    <app-loading-spinner *ngIf="loading" text="Cargando asignaciones..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && asignaciones.length === 0 && !error" message="No hay asignaciones" icon="assignment"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar asignaciones" (retry)="cargarAsignaciones()"></app-error-state>
    <table mat-table [dataSource]="asignaciones" *ngIf="!loading && asignaciones.length > 0" class="full-width">
      <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let a">{{ a.id }}</td></ng-container>
      <ng-container matColumnDef="miembroId"><th mat-header-cell *matHeaderCellDef>Miembro ID</th><td mat-cell *matCellDef="let a">{{ a.miembroId }}</td></ng-container>
      <ng-container matColumnDef="membresiaId"><th mat-header-cell *matHeaderCellDef>Membresía ID</th><td mat-cell *matCellDef="let a">{{ a.membresiaId }}</td></ng-container>
      <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let a">{{ a.estado }}</td></ng-container>
      <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let a"><button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(a)"><mat-icon>delete</mat-icon></button></td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; } .full-width { width: 100%; }`]
})
export class AsignacionesComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  columnas = ['id', 'miembroId', 'membresiaId', 'estado', 'acciones'];
  loading = false; error = false;
  constructor(private service: AsignacionService, private dialog: MatDialog) {}
  ngOnInit(): void { this.cargarAsignaciones(); }
  cargarAsignaciones(): void { this.loading = true; this.error = false; this.service.obtenerTodas().subscribe({ next: (d) => { this.asignaciones = d; this.loading = false; }, error: () => { this.loading = false; this.error = true; } }); }
  abrirCrearDialog(): void { const ref = this.dialog.open(AsignacionDialogComponent, { width: '500px' }); ref.afterClosed().subscribe((r) => { if (r) this.cargarAsignaciones(); }); }
  eliminar(a: Asignacion): void { if (confirm(`¿Eliminar asignación #${a.id}?`)) { this.service.eliminar(a.id).subscribe({ next: () => this.cargarAsignaciones() }); } }
}
