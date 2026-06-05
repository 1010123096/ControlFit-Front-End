import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container" [style.width]="width" [style.height]="height">
      <div class="skeleton-pulse" [style.border-radius]="borderRadius"></div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      display: block;
      overflow: hidden;
    }
    .skeleton-pulse {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() borderRadius = '4px';
}
