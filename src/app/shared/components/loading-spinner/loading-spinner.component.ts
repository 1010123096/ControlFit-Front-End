import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-container">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <p *ngIf="text" class="loading-text">{{ text }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
    }
    .loading-text {
      margin-top: 16px;
      color: rgba(0,0,0,0.54);
      font-size: 14px;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
  @Input() text = 'Cargando...';
}
