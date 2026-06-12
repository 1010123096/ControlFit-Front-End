import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { MembresiaService } from '../../services/membresia.service';
import { Membresia } from '../../models/membresia.model';
import { MembresiaDialogComponent } from '../../components/membresia-dialog/membresia-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-membresias',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatTooltipModule,
    LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent,
  ],
  template: `
    <div class="page-header">
      <h1>Membresías</h1>
      <button mat-raised-button color="primary" (click)="abrirCrearDialog()"><mat-icon>add</mat-icon> Nueva Membresía</button>
    </div>
    <app-loading-spinner *ngIf="loading" text="Cargando membresías..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && membresias.length === 0 && !error" message="No hay membresías registradas" icon="card_membership"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar membresías" (retry)="cargarMembresias()"></app-error-state>
    <div class="table-container" *ngIf="!loading && membresias.length > 0">
      <div style="padding:16px 16px 0;">
        <mat-form-field appearance="outline" class="search-field" style="width:100%;max-width:360px;">
          <mat-label>Buscar membresía</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Nombre" #input>
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th><td mat-cell *matCellDef="let m">{{ m.nombre }}</td></ng-container>
        <ng-container matColumnDef="duracionDias"><th mat-header-cell *matHeaderCellDef mat-sort-header>Duración</th><td mat-cell *matCellDef="let m">{{ m.duracionDias }} días</td></ng-container>
        <ng-container matColumnDef="precio"><th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th><td mat-cell *matCellDef="let m">\${{ m.precio }}</td></ng-container>
        <ng-container matColumnDef="maximoIngresosPorDia"><th mat-header-cell *matHeaderCellDef mat-sort-header>Límite día</th><td mat-cell *matCellDef="let m">{{ m.maximoIngresosPorDia }}</td></ng-container>
        <ng-container matColumnDef="maximoIngresosPorSemana"><th mat-header-cell *matHeaderCellDef mat-sort-header>Límite semana</th><td mat-cell *matCellDef="let m">{{ m.maximoIngresosPorSemana }}</td></ng-container>
        <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let m"><mat-slide-toggle [checked]="m.estado" (change)="toggleEstado(m)"></mat-slide-toggle></td></ng-container>
        <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let m"><button mat-icon-button color="primary" matTooltip="Editar" (click)="abrirEditarDialog(m)"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(m)"><mat-icon>delete</mat-icon></button></td></ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: ['']
})
export class MembresiasComponent implements OnInit {
  membresias: Membresia[] = [];
  columnas = ['nombre', 'duracionDias', 'precio', 'maximoIngresosPorDia', 'maximoIngresosPorSemana', 'estado', 'acciones'];
  loading = false; error = false;
  dataSource = new MatTableDataSource<Membresia>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: MembresiaService, private dialog: MatDialog) {}
  ngOnInit(): void { this.cargarMembresias(); }
  cargarMembresias(): void {
    this.loading = true; this.error = false;
    this.service.obtenerTodas().subscribe({
      next: (d) => {
        this.membresias = d;
        this.dataSource.data = d;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (m: Membresia, filter: string) =>
          m.nombre.toLowerCase().includes(filter);
        this.loading = false;
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }
  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }
  abrirCrearDialog(): void { const ref = this.dialog.open(MembresiaDialogComponent, { panelClass: 'dialog-responsive', autoFocus: 'first-tabbable' }); ref.afterClosed().subscribe((r) => { if (r) this.cargarMembresias(); }); }
  abrirEditarDialog(m: Membresia): void { const ref = this.dialog.open(MembresiaDialogComponent, { panelClass: 'dialog-responsive', autoFocus: 'first-tabbable', data: m }); ref.afterClosed().subscribe((r) => { if (r) this.cargarMembresias(); }); }
  toggleEstado(m: Membresia): void { this.service.actualizar(m.id, { ...m, estado: !m.estado }).subscribe({ next: () => this.cargarMembresias() }); }
  eliminar(m: Membresia): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-responsive',
      data: { title: 'Eliminar membresía', message: `¿Eliminar membresía ${m.nombre}? Esta acción no se puede deshacer.`, confirmText: 'Eliminar', type: 'danger' }
    });
    ref.afterClosed().subscribe((confirmed) => { if (confirmed) this.service.eliminar(m.id).subscribe({ next: () => this.cargarMembresias() }); });
  }
}
