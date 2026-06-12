import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="empty-state content-card">
      <div class="empty-icon-wrap">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
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
      padding: 56px 32px;
      text-align: center;
    }
    .empty-icon-wrap {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(27, 94, 32, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .empty-state mat-icon {
      font-size: 40px;
      height: 40px;
      width: 40px;
      color: var(--brand-primary);
      opacity: 0.85;
    }
    .empty-state h3 {
      margin: 0 0 8px;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .empty-state p {
      margin: 0;
      font-size: 14px;
      color: var(--text-muted);
      max-width: 360px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() message = 'No hay datos disponibles';
  @Input() submessage = '';
  @Input() icon = 'info';
}
