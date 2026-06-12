import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-container content-card">
      <mat-spinner [diameter]="diameter" color="primary"></mat-spinner>
      <p *ngIf="text" class="loading-text">{{ text }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 32px;
    }
    .loading-text {
      margin-top: 20px;
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter = 44;
  @Input() text = 'Cargando...';
}
