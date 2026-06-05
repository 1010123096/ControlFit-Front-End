import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <h3>{{ message }}</h3>
      <p *ngIf="submessage">{{ submessage }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      color: rgba(0,0,0,0.54);
    }
    .empty-state mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    .empty-state h3 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 500;
    }
    .empty-state p {
      margin: 0;
      font-size: 14px;
      opacity: 0.7;
    }
  `]
})
export class EmptyStateComponent {
  @Input() message = 'No hay datos disponibles';
  @Input() submessage = '';
  @Input() icon = 'info';
}
