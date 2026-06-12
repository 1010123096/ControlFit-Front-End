import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsistenciaService } from '../../services/asistencia.service';
import { MiembroService } from '../../../miembros/services/miembro.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { Miembro } from '../../../miembros/models/miembro.model';
import { PreviewIngreso } from '../../models/asistencia.model';

@Component({
  selector: 'app-registrar-asistencia',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatAutocompleteModule, MatIconModule,
    MatTabsModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-header">
      <div>
        <h1>Registrar Asistencia</h1>
        <p class="page-subtitle">Busca al miembro, confirma su membresía y registra el ingreso</p>
      </div>
    </div>

    <mat-card class="register-card surface-card">
      <mat-card-content>
        <mat-tab-group animationDuration="200ms" (selectedIndexChange)="onTabChange($event)">
          <mat-tab label="Buscar miembro">
            <form class="tab-form" [formGroup]="searchForm" (ngSubmit)="onSearchSubmit()">
              <mat-form-field appearance="outline" class="full-width search-member-field">
                <mat-label>Miembro</mat-label>
                <input matInput formControlName="miembroCtrl" [matAutocomplete]="autoMiembro"
                  #memberTrigger="matAutocompleteTrigger"
                  placeholder="Escribe al menos 2 letras del nombre" autofocus>
                <mat-icon matPrefix aria-hidden="true">person_search</mat-icon>
              </mat-form-field>
              <mat-autocomplete #autoMiembro="matAutocomplete" [displayWith]="displayMiembro"
                [autoActiveFirstOption]="false"
                panelClass="member-autocomplete-panel"
                (optionSelected)="onMiembroSelected($event)">
                <mat-option *ngFor="let m of filteredMiembros$ | async" [value]="m">
                  <div class="member-option">
                    <span class="member-option-name">{{ m.nombreCompleto }}</span>
                    <span class="member-option-meta">ID {{ m.id }} · {{ m.correo }}</span>
                  </div>
                </mat-option>
                <mat-option *ngIf="showSearchHint$ | async" disabled class="autocomplete-hint">
                  Escribe al menos 2 caracteres para buscar
                </mat-option>
                <mat-option *ngIf="showNoResults$ | async" disabled class="autocomplete-hint">
                  No se encontraron miembros
                </mat-option>
              </mat-autocomplete>
            </form>
          </mat-tab>

          <mat-tab label="Código rápido">
            <form class="tab-form" [formGroup]="quickForm" (ngSubmit)="onQuickSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>ID o teléfono</mat-label>
                <input matInput formControlName="codigo" placeholder="Ej: 1002 o 999888777" inputmode="numeric">
                <mat-icon matPrefix aria-hidden="true">pin</mat-icon>
                <mat-hint>Ingresa el ID del miembro o su teléfono completo</mat-hint>
              </mat-form-field>
              <button mat-stroked-button color="primary" type="submit" [disabled]="quickForm.invalid || loadingPreview">
                Buscar
              </button>
            </form>
          </mat-tab>
        </mat-tab-group>

        <div class="preview-panel" *ngIf="loadingPreview">
          <mat-spinner diameter="32"></mat-spinner>
          <span>Verificando membresía...</span>
        </div>

        <div class="preview-panel" *ngIf="preview && !loadingPreview">
          <div class="preview-header">
            <mat-icon aria-hidden="true">badge</mat-icon>
            <div>
              <strong>{{ preview.nombreMiembro }}</strong>
              <div class="member-meta">ID {{ preview.miembroId }}</div>
            </div>
            <mat-chip-set>
              <mat-chip [class.chip-ok]="preview.puedeIngresar" [class.chip-block]="!preview.puedeIngresar">
                {{ preview.puedeIngresar ? 'Puede ingresar' : 'No puede ingresar' }}
              </mat-chip>
              <mat-chip *ngIf="preview.yaIngresoHoy" class="chip-block">Ya ingresó hoy</mat-chip>
            </mat-chip-set>
          </div>
          <dl class="preview-details">
            <div><dt>Membresía</dt><dd>{{ preview.nombreMembresia || '—' }}</dd></div>
            <div><dt>Vence</dt><dd>{{ preview.fechaVencimiento | date:'dd/MM/yyyy' }}</dd></div>
            <div><dt>Esta semana</dt><dd>{{ preview.ingresosSemana }} / {{ preview.maximoIngresosSemana ?? '∞' }}</dd></div>
          </dl>
          <p class="block-reason" *ngIf="!preview.puedeIngresar">{{ preview.motivoBloqueo }}</p>
          <button mat-raised-button color="primary" type="button"
            [disabled]="!preview.puedeIngresar || submitting"
            (click)="registrarIngreso()" class="submit-btn">
            <mat-icon aria-hidden="true">how_to_reg</mat-icon>
            Registrar ingreso manual
          </button>
        </div>

        <div class="biometric-placeholder">
          <mat-icon aria-hidden="true">fingerprint</mat-icon>
          <div>
            <strong>Lector de huellas — próximamente</strong>
            <p>Cuando conectes el lector, el ingreso se registrará automáticamente como fuente biométrica.</p>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .page-subtitle { margin: 4px 0 0; color: var(--text-muted); font-size: 14px; }
    .register-card { max-width: 640px; overflow: visible !important; }
    .tab-form { padding-top: 20px; position: relative; z-index: 2; }
    .full-width { width: 100%; }
    .preview-panel {
      margin-top: 20px; padding: 20px; border-radius: 10px;
      background: rgba(27, 94, 32, 0.06); border: 1px solid rgba(27, 94, 32, 0.15);
      display: flex; flex-direction: column; gap: 12px;
      position: relative; z-index: 1;
    }
    .preview-header { display: flex; align-items: flex-start; gap: 12px; }
    .preview-header mat-icon { color: var(--primary-color, #1B5E20); margin-top: 2px; }
    .preview-header > div { flex: 1; }
    .member-meta { color: var(--text-muted); font-size: 13px; }
    .preview-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 0; }
    .preview-details dt { font-size: 12px; color: var(--text-muted); margin: 0; }
    .preview-details dd { margin: 4px 0 0; font-weight: 500; }
    .chip-ok { --mdc-chip-label-text-color: #1B5E20; background: rgba(27, 94, 32, 0.12) !important; }
    .chip-block { --mdc-chip-label-text-color: #b71c1c; background: rgba(183, 28, 28, 0.1) !important; }
    .block-reason { margin: 0; color: #b71c1c; font-size: 14px; }
    .submit-btn { width: 100%; height: 48px; font-size: 15px; }
    .biometric-placeholder {
      margin-top: 20px; padding: 16px; border-radius: 10px;
      display: flex; gap: 12px; align-items: flex-start;
      background: #f5f5f5; border: 1px dashed #bdbdbd; color: #616161;
    }
    .biometric-placeholder mat-icon { opacity: 0.7; }
    .biometric-placeholder p { margin: 4px 0 0; font-size: 13px; }
    .preview-panel mat-spinner { margin: 0 auto; }
  `]
})
export class RegistrarComponent implements OnInit {
  @ViewChild('memberTrigger') memberTrigger!: MatAutocompleteTrigger;

  searchForm;
  quickForm;
  miembros: Miembro[] = [];
  filteredMiembros$!: Observable<Miembro[]>;
  showSearchHint$!: Observable<boolean>;
  showNoResults$!: Observable<boolean>;
  selectedMiembroId: number | null = null;
  preview: PreviewIngreso | null = null;
  loadingPreview = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private service: AsistenciaService,
    private miembroService: MiembroService,
    private notification: NotificationService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      miembroCtrl: new FormControl<Miembro | null>(null, Validators.required),
    });
    this.quickForm = this.fb.group({ codigo: ['', [Validators.required, Validators.minLength(1)]] });
  }

  ngOnInit(): void {
    this.miembroService.obtenerTodos().subscribe({
      next: (data) => {
        this.miembros = data;
        const control = this.searchForm.get('miembroCtrl')!;
        const term$ = control.valueChanges.pipe(
          startWith(''),
          map(value => {
            if (value && typeof value !== 'string') return '';
            return typeof value === 'string' ? value : '';
          })
        );

        term$.subscribe(() => {
          if (typeof control.value === 'string') {
            this.preview = null;
            this.selectedMiembroId = null;
          }
        });

        this.filteredMiembros$ = control.valueChanges.pipe(
          startWith(''),
          map(value => {
            if (value && typeof value !== 'string') return [];
            const term = typeof value === 'string' ? value : '';
            return this.filterMiembros(term);
          })
        );

        this.showSearchHint$ = term$.pipe(
          map(term => term.trim().length < 2)
        );

        this.showNoResults$ = combineLatest([term$, this.filteredMiembros$]).pipe(
          map(([term, results]) => term.trim().length >= 2 && results.length === 0)
        );
      }
    });
  }

  displayMiembro = (m: Miembro | null): string => m?.nombreCompleto ?? '';

  onTabChange(_index: number): void {
    this.preview = null;
    this.selectedMiembroId = null;
  }

  onMiembroSelected(event: { option: { value: Miembro } }): void {
    this.selectedMiembroId = event.option.value.id;
    this.memberTrigger?.closePanel();
    this.loadPreview(this.selectedMiembroId);
  }

  onSearchSubmit(): void {
    const member = this.searchForm.get('miembroCtrl')?.value;
    if (member?.id) {
      this.selectedMiembroId = member.id;
      this.loadPreview(member.id);
    }
  }

  onQuickSubmit(): void {
    const codigo = (this.quickForm.get('codigo')?.value ?? '').trim();
    if (!codigo) return;

    const byId = this.miembros.find(m => m.id === Number(codigo));
    const byPhone = this.miembros.find(m => m.telefono === codigo);
    const member = byId ?? byPhone;

    if (!member) {
      this.notification.showError('No se encontró un miembro con ese ID o teléfono');
      this.preview = null;
      return;
    }

    this.selectedMiembroId = member.id;
    this.loadPreview(member.id);
  }

  registrarIngreso(): void {
    if (!this.selectedMiembroId || !this.preview?.puedeIngresar) return;
    this.submitting = true;
    this.service.registrar({ miembroId: this.selectedMiembroId }).subscribe({
      next: () => {
        this.notification.showSuccess('Asistencia registrada correctamente');
        this.router.navigate(['/gym-admin/asistencias']);
      },
      error: () => {
        this.submitting = false;
        if (this.selectedMiembroId) {
          this.loadPreview(this.selectedMiembroId);
        }
      }
    });
  }

  private loadPreview(miembroId: number): void {
    this.loadingPreview = true;
    this.preview = null;
    this.service.preview(miembroId).subscribe({
      next: (data) => {
        this.preview = data;
        this.loadingPreview = false;
      },
      error: () => {
        this.loadingPreview = false;
        this.preview = null;
      }
    });
  }

  private filterMiembros(term: string): Miembro[] {
    const q = term.toLowerCase().trim();
    if (q.length < 2) return [];
    return this.miembros.filter(m =>
      m.nombreCompleto.toLowerCase().includes(q) ||
      m.correo.toLowerCase().includes(q) ||
      (m.telefono && m.telefono.includes(q)) ||
      String(m.id).includes(q)
    ).slice(0, 15);
  }
}
