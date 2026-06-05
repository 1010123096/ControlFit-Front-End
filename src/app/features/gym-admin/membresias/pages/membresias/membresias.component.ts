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
import { MembresiaService } from '../../services/membresia.service';
import { Membresia } from '../../models/membresia.model';
import { MembresiaDialogComponent } from '../../components/membresia-dialog/membresia-dialog.component';

@Component({
  selector: 'app-membresias',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatSlideToggleModule,
    LoadingSpinnerComponent, EmptyStateComponent, ErrorStateComponent,
  ],
  template: `
    <div class="header"><h1>Membresías</h1><button mat-raised-button color="primary" (click)="abrirCrearDialog()"><mat-icon>add</mat-icon> Nueva Membresía</button></div>
    <app-loading-spinner *ngIf="loading" text="Cargando membresías..."></app-loading-spinner>
    <app-empty-state *ngIf="!loading && membresias.length === 0 && !error" message="No hay membresías registradas" icon="card_membership"></app-empty-state>
    <app-error-state *ngIf="error" message="Error al cargar membresías" (retry)="cargarMembresias()"></app-error-state>
    <table mat-table [dataSource]="membresias" *ngIf="!loading && membresias.length > 0" class="full-width">
      <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef>Nombre</th><td mat-cell *matCellDef="let m">{{ m.nombre }}</td></ng-container>
      <ng-container matColumnDef="duracionDias"><th mat-header-cell *matHeaderCellDef>Duración</th><td mat-cell *matCellDef="let m">{{ m.duracionDias }} días</td></ng-container>
      <ng-container matColumnDef="precio"><th mat-header-cell *matHeaderCellDef>Precio</th><td mat-cell *matCellDef="let m">\${{ m.precio }}</td></ng-container>
      <ng-container matColumnDef="estado"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let m"><mat-slide-toggle [checked]="m.estado" (change)="toggleEstado(m)"></mat-slide-toggle></td></ng-container>
      <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let m"><button mat-icon-button color="primary" matTooltip="Editar" (click)="abrirEditarDialog(m)"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" matTooltip="Eliminar" (click)="eliminar(m)"><mat-icon>delete</mat-icon></button></td></ng-container>
      <tr mat-header-row *matHeaderRowDef="columnas"></tr><tr mat-row *matRowDef="let row; columns: columnas;"></tr>
    </table>
  `,
  styles: [`.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; } .full-width { width: 100%; }`]
})
export class MembresiasComponent implements OnInit {
  membresias: Membresia[] = [];
  columnas = ['nombre', 'duracionDias', 'precio', 'estado', 'acciones'];
  loading = false; error = false;
  constructor(private service: MembresiaService, private dialog: MatDialog) {}
  ngOnInit(): void { this.cargarMembresias(); }
  cargarMembresias(): void { this.loading = true; this.error = false; this.service.obtenerTodas().subscribe({ next: (d) => { this.membresias = d; this.loading = false; }, error: () => { this.loading = false; this.error = true; } }); }
  abrirCrearDialog(): void { const ref = this.dialog.open(MembresiaDialogComponent, { width: '500px' }); ref.afterClosed().subscribe((r) => { if (r) this.cargarMembresias(); }); }
  abrirEditarDialog(m: Membresia): void { const ref = this.dialog.open(MembresiaDialogComponent, { width: '500px', data: m }); ref.afterClosed().subscribe((r) => { if (r) this.cargarMembresias(); }); }
  toggleEstado(m: Membresia): void { this.service.actualizar(m.id, { estado: !m.estado }).subscribe({ next: () => this.cargarMembresias() }); }
  eliminar(m: Membresia): void { if (confirm(`¿Eliminar membresía ${m.nombre}?`)) { this.service.eliminar(m.id).subscribe({ next: () => this.cargarMembresias() }); } }
}
