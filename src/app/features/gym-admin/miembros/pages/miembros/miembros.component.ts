import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { MiembroService } from '../../services/miembro.service';
import { Miembro } from '../../models/miembro.model';
import { MiembroDialogComponent } from '../../components/miembro-dialog/miembro-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-miembros',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatSnackBarModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatTooltipModule,
    LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent, ConfirmDialogComponent,
  ],
  template: `
    <div class="page-header">
      <h1>Miembros</h1>
      <button mat-raised-button color="primary" (click)="abrirCrearDialog()">
        <mat-icon>add</mat-icon> Nuevo Miembro
      </button>
    </div>

    <app-loading-spinner *ngIf="loading" text="Cargando miembros..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && miembros.length === 0 && !error" message="No hay miembros registrados" icon="people"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar miembros" (retry)="cargarMiembros()"></app-error-state>

    <div class="table-container" *ngIf="!loading && miembros.length > 0">
      <div style="padding: 16px 16px 0;">
        <mat-form-field appearance="outline" class="search-field" style="width:100%;max-width:360px;">
          <mat-label>Buscar miembro</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Nombre, correo o teléfono" #input>
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>
      </div>
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="nombreCompleto">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
          <td mat-cell *matCellDef="let m">{{ m.nombreCompleto }}</td>
        </ng-container>
        <ng-container matColumnDef="correo">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Correo</th>
          <td mat-cell *matCellDef="let m">{{ m.correo }}</td>
        </ng-container>
        <ng-container matColumnDef="telefono">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Teléfono</th>
          <td mat-cell *matCellDef="let m">{{ m.telefono }}</td>
        </ng-container>
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let m">
            <button mat-icon-button color="primary" matTooltip="Editar" (click)="abrirEditarDialog(m)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminarMiembro(m)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: ['']
})
export class MiembrosComponent implements OnInit {
  miembros: Miembro[] = [];
  columnas = ['nombreCompleto', 'correo', 'telefono', 'acciones'];
  loading = false;
  error = false;
  dataSource = new MatTableDataSource<Miembro>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private miembroService: MiembroService, private dialog: MatDialog) {}

  ngOnInit(): void { this.cargarMiembros(); }

  cargarMiembros(): void {
    this.loading = true; this.error = false;
    this.miembroService.obtenerTodos().subscribe({
      next: (data) => {
        this.miembros = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (m: Miembro, filter: string) =>
          m.nombreCompleto.toLowerCase().includes(filter) ||
          m.correo.toLowerCase().includes(filter) ||
          m.telefono.toLowerCase().includes(filter);
        this.loading = false;
      },
      error: () => { this.loading = false; this.error = true; }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirCrearDialog(): void {
    const ref = this.dialog.open(MiembroDialogComponent, { panelClass: 'dialog-responsive', autoFocus: 'first-tabbable' });
    ref.afterClosed().subscribe((result) => { if (result) this.cargarMiembros(); });
  }

  abrirEditarDialog(miembro: Miembro): void {
    const ref = this.dialog.open(MiembroDialogComponent, { panelClass: 'dialog-responsive', autoFocus: 'first-tabbable', data: miembro });
    ref.afterClosed().subscribe((result) => { if (result) this.cargarMiembros(); });
  }

  eliminarMiembro(miembro: Miembro): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-responsive',
      data: { title: 'Eliminar miembro', message: `¿Está seguro de eliminar a ${miembro.nombreCompleto}? Esta acción no se puede deshacer.`, confirmText: 'Eliminar', type: 'danger' }
    });
    ref.afterClosed().subscribe((confirmed) => { if (confirmed) this.miembroService.eliminar(miembro.id).subscribe({ next: () => this.cargarMiembros() }); });
  }
}
