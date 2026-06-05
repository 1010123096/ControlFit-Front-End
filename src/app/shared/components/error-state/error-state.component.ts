import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="error-state">
      <mat-icon>error_outline</mat-icon>
      <h3>{{ message }}</h3>
      <p *ngIf="detail">{{ detail }}</p>
      <button mat-raised-button color="primary" (click)="retry.emit()" *ngIf="showRetry">
        Reintentar
      </button>
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      color: #f44336;
    }
    .error-state mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      margin-bottom: 16px;
    }
    .error-state h3 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
    }
    .error-state p {
      margin: 0 0 16px;
      font-size: 14px;
      opacity: 0.7;
      color: rgba(0,0,0,0.54);
    }
  `]
})
export class ErrorStateComponent {
  @Input() message = 'Ha ocurrido un error';
  @Input() detail = '';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}
