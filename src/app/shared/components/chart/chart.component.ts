import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas [attr.role]="'img'" [attr.aria-label]="ariaLabel"></canvas>`,
  styles: [`canvas { width: 100%; height: 100%; display: block; }`]
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input() type: 'bar' | 'line' | 'doughnut' | 'pie' = 'bar';
  @Input() labels: string[] = [];
  @Input() datasets: { label: string; data: number[]; backgroundColor?: string | string[] }[] = [];
  @Input() options?: ChartConfiguration['options'];
  @Input() ariaLabel = 'Gráfico de datos';

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.canvas) return;
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const defaultOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: this.type !== 'bar' },
      },
      scales: this.type === 'bar' || this.type === 'line' ? {
        y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
        x: { grid: { display: false } }
      } : undefined,
    };

    this.chart = new Chart(ctx, {
      type: this.type,
      data: { labels: this.labels, datasets: this.datasets as any },
      options: { ...defaultOptions, ...this.options },
    });
  }

  private updateChart(): void {
    if (!this.chart) return;
    this.chart.data.labels = this.labels;
    this.chart.data.datasets = this.datasets as any;
    this.chart.update();
  }
}
