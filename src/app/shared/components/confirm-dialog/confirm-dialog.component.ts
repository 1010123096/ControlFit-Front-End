import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="margin:0;padding:20px 24px 0;font-size:18px;font-weight:500;">
      <mat-icon style="vertical-align:middle;margin-right:8px;color:var(--mat-sys-error);">error_outline</mat-icon>
      {{ data.title }}
    </h2>
    <mat-dialog-content style="padding:16px 24px;font-size:15px;color:var(--text-secondary);line-height:1.5;">
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding:12px 24px;border-top:1px solid var(--mat-sys-outline-variant);">
      <button mat-button [mat-dialog-close]="false">{{ data.cancelText || 'Cancelar' }}</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>
        {{ data.confirmText || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: ['']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
