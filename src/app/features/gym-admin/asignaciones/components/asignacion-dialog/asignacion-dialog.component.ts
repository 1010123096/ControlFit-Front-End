import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsignacionService } from '../../services/asignacion.service';
import { JwtDecodedService } from '../../../../../core/services/jwt-decoded.service';
import { MiembroService } from '../../../miembros/services/miembro.service';
import { MembresiaService } from '../../../membresias/services/membresia.service';
import { Miembro } from '../../../miembros/models/miembro.model';
import { Membresia } from '../../../membresias/models/membresia.model';

@Component({
  selector: 'app-asignacion-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatAutocompleteModule, MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title style="margin:0;padding:20px 24px 0;">Nueva Asignación</h2>
    <mat-dialog-content style="padding-top:16px;">
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="dialog-field">
          <mat-label>Miembro</mat-label>
          <input matInput formControlName="miembroCtrl" [matAutocomplete]="autoMiembro" placeholder="Buscar miembro por nombre">
          <mat-icon matPrefix>person_search</mat-icon>
          <mat-error *ngIf="form.get('miembroCtrl')?.hasError('required')">Seleccione un miembro</mat-error>
        </mat-form-field>
        <mat-autocomplete #autoMiembro="matAutocomplete" [displayWith]="displayMiembro" (optionSelected)="onMiembroSelected($event)">
          <mat-option *ngFor="let m of filteredMiembros$ | async" [value]="m">
            <span style="font-weight:500;">{{ m.nombreCompleto }}</span>
            <span style="margin-left:8px;color:#64748b;font-size:13px;">{{ m.correo }}</span>
          </mat-option>
        </mat-autocomplete>

        <mat-form-field appearance="outline" class="dialog-field">
          <mat-label>Membresía</mat-label>
          <input matInput formControlName="membresiaCtrl" [matAutocomplete]="autoMembresia" placeholder="Buscar membresía por nombre">
          <mat-icon matPrefix>card_membership</mat-icon>
          <mat-error *ngIf="form.get('membresiaCtrl')?.hasError('required')">Seleccione una membresía</mat-error>
        </mat-form-field>
        <mat-autocomplete #autoMembresia="matAutocomplete" [displayWith]="displayMembresia" (optionSelected)="onMembresiaSelected($event)">
          <mat-option *ngFor="let m of filteredMembresias$ | async" [value]="m">
            <span style="font-weight:500;">{{ m.nombre }}</span>
            <span style="margin-left:8px;color:#64748b;font-size:13px;">\${{ m.precio }} - {{ m.duracionDias }} días</span>
          </mat-option>
        </mat-autocomplete>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding:16px 24px;">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()" [disabled]="form.invalid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: ['']
})
export class AsignacionDialogComponent implements OnInit {
  form;
  miembros: Miembro[] = [];
  membresias: Membresia[] = [];
  filteredMiembros$!: Observable<Miembro[]>;
  filteredMembresias$!: Observable<Membresia[]>;
  selectedMiembro: Miembro | null = null;
  selectedMembresia: Membresia | null = null;

  constructor(
    private fb: FormBuilder,
    private service: AsignacionService,
    private miembroService: MiembroService,
    private membresiaService: MembresiaService,
    private jwtDecodedService: JwtDecodedService,
    private dialogRef: MatDialogRef<AsignacionDialogComponent>
  ) {
    this.form = this.fb.group({
      miembroCtrl: ['', Validators.required],
      membresiaCtrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.miembroService.obtenerTodos().subscribe(d => {
      this.miembros = d;
      this.setupAutocomplete();
    });
    this.membresiaService.obtenerTodas().subscribe(d => {
      this.membresias = d;
      this.setupAutocomplete();
    });
  }

  private setupAutocomplete(): void {
    this.filteredMiembros$ = this.form.get('miembroCtrl')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterMiembros(value);
        }
        return this.miembros;
      })
    );
    this.filteredMembresias$ = this.form.get('membresiaCtrl')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === 'string') {
          return this._filterMembresias(value);
        }
        return this.membresias;
      })
    );
  }

  private _filterMiembros(value: string): Miembro[] {
    const filter = value.toLowerCase();
    return this.miembros.filter(m =>
      m.nombreCompleto.toLowerCase().includes(filter) ||
      m.correo.toLowerCase().includes(filter)
    );
  }

  private _filterMembresias(value: string): Membresia[] {
    const filter = value.toLowerCase();
    return this.membresias.filter(m =>
      m.nombre.toLowerCase().includes(filter)
    );
  }

  displayMiembro(m: Miembro): string {
    return m ? m.nombreCompleto : '';
  }

  displayMembresia(m: Membresia): string {
    return m ? m.nombre : '';
  }

  onMiembroSelected(event: any): void {
    this.selectedMiembro = event.option.value;
  }

  onMembresiaSelected(event: any): void {
    this.selectedMembresia = event.option.value;
  }

  guardar(): void {
    if (this.form.invalid || !this.selectedMiembro || !this.selectedMembresia) return;
    const payload = {
      miembroId: this.selectedMiembro.id,
      membresiaId: this.selectedMembresia.id,
      gimnasioId: this.jwtDecodedService.getGimnasioId(),
    };
    this.service.crear(payload).subscribe({ next: () => this.dialogRef.close(true) });
  }
}
