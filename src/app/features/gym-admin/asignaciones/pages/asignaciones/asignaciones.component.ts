import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatTooltipModule,
    LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent,
  ],
  template: `
    <div class="page-header">
      <h1>Asignaciones</h1>
      <button mat-raised-button color="primary" (click)="abrirCrearDialog()"><mat-icon>add</mat-icon> Nueva Asignación</button>
    </div>
    <app-loading-spinner *ngIf="loading" text="Cargando asignaciones..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && asignaciones.length === 0 && !error" message="No hay asignaciones" icon="assignment"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar asignaciones" (retry)="cargarAsignaciones()"></app-error-state>
    <div class="table-container" *ngIf="!loading && asignaciones.length > 0">
      <div style="padding:16px 16px 0;">
        <mat-form-field appearance="outline" class="search-field" style="width:100%;max-width:360px;">
          <mat-label>Buscar por ID</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="ID de asignación" #input>
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th><td mat-cell *matCellDef="let a">{{ a.id }}</td></ng-container>
        <ng-container matColumnDef="miembroId"><th mat-header-cell *matHeaderCellDef mat-sort-header>Miembro ID</th><td mat-cell *matCellDef="let a">{{ a.miembroId }}</td></ng-container>
        <ng-container matColumnDef="membresiaId"><th mat-header-cell *matHeaderCellDef mat-sort-header>Membresía ID</th><td mat-cell *matCellDef="let a">{{ a.membresiaId }}</td></ng-container>
        <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let a">{{ a.estado ? 'Activa' : 'Inactiva' }}</td></ng-container>
        <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let a"><button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(a)"><mat-icon>delete</mat-icon></button></td></ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: ['']
})
export class AsignacionesComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  columnas = ['id', 'miembroId', 'membresiaId', 'estado', 'acciones'];
  loading = false; error = false;
  dataSource = new MatTableDataSource<Asignacion>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: AsignacionService, private dialog: MatDialog) {}
  ngOnInit(): void { this.cargarAsignaciones(); }
  cargarAsignaciones(): void {
    this.loading = true; this.error = false;
    this.service.obtenerTodas().subscribe({
      next: (d) => {
        this.asignaciones = d;
        this.dataSource.data = d;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }
  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }
  abrirCrearDialog(): void { const ref = this.dialog.open(AsignacionDialogComponent, { width: '500px' }); ref.afterClosed().subscribe((r) => { if (r) this.cargarAsignaciones(); }); }
  eliminar(a: Asignacion): void { if (confirm(`¿Eliminar asignación #${a.id}?`)) { this.service.eliminar(a.id).subscribe({ next: () => this.cargarAsignaciones() }); } }
}
