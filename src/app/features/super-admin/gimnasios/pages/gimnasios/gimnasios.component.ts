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
import { GimnasioService } from '../../services/gimnasio.service';
import { Gimnasio } from '../../models/gimnasio.model';
import { GimnasioDialogComponent } from '../../components/gimnasio-dialog/gimnasio-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gimnasios',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatTooltipModule,
    LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent,
  ],
  template: `
    <div class="page-header">
      <h1>Gimnasios</h1>
      <button mat-raised-button color="primary" (click)="abrirCrearDialog()"><mat-icon>add</mat-icon> Nuevo Gimnasio</button>
    </div>
    <app-loading-spinner *ngIf="loading" text="Cargando gimnasios..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && gimnasios.length === 0 && !error" message="No hay gimnasios registrados" icon="business"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar gimnasios" (retry)="cargarGimnasios()"></app-error-state>
    <div class="table-container" *ngIf="!loading && gimnasios.length > 0">
      <div style="padding:16px 16px 0;">
        <mat-form-field appearance="outline" class="search-field" style="width:100%;max-width:360px;">
          <mat-label>Buscar gimnasio</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Nombre o dirección" #input>
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th><td mat-cell *matCellDef="let g">{{ g.nombre }}</td></ng-container>
        <ng-container matColumnDef="direccion"><th mat-header-cell *matHeaderCellDef mat-sort-header>Dirección</th><td mat-cell *matCellDef="let g">{{ g.direccion }}</td></ng-container>
        <ng-container matColumnDef="telefono"><th mat-header-cell *matHeaderCellDef mat-sort-header>Teléfono</th><td mat-cell *matCellDef="let g">{{ g.telefono }}</td></ng-container>
        <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th><td mat-cell *matCellDef="let g"><mat-slide-toggle [checked]="g.estado" (change)="toggleEstado(g)"></mat-slide-toggle></td></ng-container>
        <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let g"><button mat-icon-button color="primary" matTooltip="Editar" (click)="abrirEditarDialog(g)"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(g)"><mat-icon>delete</mat-icon></button></td></ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: ['']
})
export class GimnasiosComponent implements OnInit {
  gimnasios: Gimnasio[] = [];
  columnas = ['nombre', 'direccion', 'telefono', 'estado', 'acciones'];
  loading = false; error = false;
  dataSource = new MatTableDataSource<Gimnasio>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: GimnasioService, private dialog: MatDialog) {}
  ngOnInit(): void { this.cargarGimnasios(); }
  cargarGimnasios(): void {
    this.loading = true; this.error = false;
    this.service.obtenerTodos().subscribe({
      next: (d) => {
        this.gimnasios = d;
        this.dataSource.data = d;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (g: Gimnasio, filter: string) =>
          g.nombre.toLowerCase().includes(filter) ||
          g.direccion.toLowerCase().includes(filter);
        this.loading = false;
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }
  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }
  abrirCrearDialog(): void { const ref = this.dialog.open(GimnasioDialogComponent, { panelClass: 'dialog-responsive', autoFocus: 'first-tabbable' }); ref.afterClosed().subscribe((r) => { if (r) this.cargarGimnasios(); }); }
  abrirEditarDialog(g: Gimnasio): void { const ref = this.dialog.open(GimnasioDialogComponent, { panelClass: 'dialog-responsive', autoFocus: 'first-tabbable', data: g }); ref.afterClosed().subscribe((r) => { if (r) this.cargarGimnasios(); }); }
  toggleEstado(g: Gimnasio): void { this.service.actualizar({ id: g.id, nombre: g.nombre, direccion: g.direccion, telefono: g.telefono, estado: !g.estado } as any).subscribe({ next: () => this.cargarGimnasios() }); }
  eliminar(g: Gimnasio): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-responsive',
      data: { title: 'Eliminar gimnasio', message: `¿Eliminar gimnasio ${g.nombre}? Esta acción no se puede deshacer.`, confirmText: 'Eliminar', type: 'danger' }
    });
    ref.afterClosed().subscribe((confirmed) => { if (confirmed) this.service.eliminar(g.id).subscribe({ next: () => this.cargarGimnasios() }); });
  }
}
