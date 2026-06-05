import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../../shared/components/error-state/error-state.component';
import { GimnasioService } from '../../services/gimnasio.service';
import { Gimnasio } from '../../models/gimnasio.model';
import { GimnasioDialogComponent } from '../../components/gimnasio-dialog/gimnasio-dialog.component';

@Component({
  selector: 'app-gimnasios',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSlideToggleModule, LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="header"><h1>Gimnasios</h1><button mat-raised-button color="primary" (click)="abrirCrearDialog()"><mat-icon>add</mat-icon> Nuevo Gimnasio</button></div>
    <app-loading-spinner *ngIf="loading" text="Cargando gimnasios..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && gimnasios.length === 0 && !error" message="No hay gimnasios registrados" icon="business"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar gimnasios" (retry)="cargarGimnasios()"></app-error-state>
    <table mat-table [dataSource]="gimnasios" *ngIf="!loading && gimnasios.length > 0" class="full-width">
      <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let g">{{ g.nombre }}</td></ng-container>
      <ng-container matColumnDef="direccion"><th mat-header-cell *matHeaderCellDef>Dirección</th><td mat-cell *matCellDef="let g">{{ g.direccion }}</td></ng-container>
      <ng-container matColumnDef="telefono"><th mat-header-cell *matHeaderCellDef>Teléfono</th><td mat-cell *matCellDef="let g">{{ g.telefono }}</td></ng-container>
      <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let g"><mat-slide-toggle [checked]="g.estado" (change)="toggleEstado(g)"></mat-slide-toggle></td></ng-container>
      <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let g"><button mat-icon-button color="primary" matTooltip="Editar" (click)="abrirEditarDialog(g)"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(g)"><mat-icon>delete</mat-icon></button></td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; } .full-width { width: 100%; }`]
})
export class GimnasiosComponent implements OnInit {
  gimnasios: Gimnasio[] = [];
  columnas = ['nombre', 'direccion', 'telefono', 'estado', 'acciones'];
  loading = false; error = false;
  constructor(private service: GimnasioService, private dialog: MatDialog) {}
  ngOnInit(): void { this.cargarGimnasios(); }
  cargarGimnasios(): void { this.loading = true; this.error = false; this.service.obtenerTodos().subscribe({ next: (d) => { this.gimnasios = d; this.loading = false; }, error: () => { this.loading = false; this.error = true; } }); }
  abrirCrearDialog(): void { const ref = this.dialog.open(GimnasioDialogComponent, { width: '500px' }); ref.afterClosed().subscribe((r) => { if (r) this.cargarGimnasios(); }); }
  abrirEditarDialog(g: Gimnasio): void { const ref = this.dialog.open(GimnasioDialogComponent, { width: '500px', data: g }); ref.afterClosed().subscribe((r) => { if (r) this.cargarGimnasios(); }); }
  toggleEstado(g: Gimnasio): void { this.service.actualizar({ id: g.id, nombre: g.nombre, direccion: g.direccion, telefono: g.telefono, estado: !g.estado } as any).subscribe({ next: () => this.cargarGimnasios() }); }
  eliminar(g: Gimnasio): void { if (confirm(`¿Eliminar gimnasio ${g.nombre}?`)) { this.service.eliminar(g.id).subscribe({ next: () => this.cargarGimnasios() }); } }
}
