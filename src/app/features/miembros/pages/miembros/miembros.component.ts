import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { MiembrosService } from '../../services/miembro.service';
import { Miembro } from '../../models/miembro.model';
import { CrearMiembroDialogComponent } from '../../dialogs/crear-miembro/crear-miembro.component';

@Component({
  selector: 'app-miembros-legacy',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="header"><h1>Miembros (Legacy)</h1><button mat-raised-button color="primary" (click)="abrirCrearDialog()"><mat-icon>add</mat-icon> Nuevo Miembro</button></div>
    <app-loading-spinner *ngIf="loading" text="Cargando..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && miembros.length === 0 && !error" message="No hay miembros" icon="people"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar" (retry)="cargarMiembros()"></app-error-state>
    <table mat-table [dataSource]="miembros" *ngIf="!loading && miembros.length > 0" class="full-width">
      <ng-container matColumnDef="nombreCompleto"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let m">{{ m.nombreCompleto }}</td></ng-container>
      <ng-container matColumnDef="correo"><th mat-header-cell *matHeaderCellDef>Correo</th><td mat-cell *matCellDef="let m">{{ m.correo }}</td></ng-container>
      <ng-container matColumnDef="telefono"><th mat-header-cell *matHeaderCellDef>Teléfono</th><td mat-cell *matCellDef="let m">{{ m.telefono }}</td></ng-container>
      <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let m"><button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(m)"><mat-icon>delete</mat-icon></button></td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; } .full-width { width: 100%; }`]
})
export class MiembrosLegacyComponent implements OnInit {
  miembros: Miembro[] = [];
  columnas = ['nombreCompleto', 'correo', 'telefono', 'acciones'];
  loading = false; error = false;
  constructor(private service: MiembrosService, private dialog: MatDialog) {}
  ngOnInit(): void { this.cargarMiembros(); }
  cargarMiembros(): void { this.loading = true; this.error = false; this.service.obtenerTodos().subscribe({ next: (d) => { this.miembros = d; this.loading = false; }, error: () => { this.loading = false; this.error = true; } }); }
  abrirCrearDialog(): void { const ref = this.dialog.open(CrearMiembroDialogComponent, { width: '500px' }); ref.afterClosed().subscribe((r) => { if (r) this.cargarMiembros(); }); }
  eliminar(m: Miembro): void { if (confirm(`¿Eliminar a ${m.nombreCompleto}?`)) { this.service.eliminar(m.id).subscribe({ next: () => this.cargarMiembros() }); } }
}
