import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { TokenService } from '../../../core/services/token.service';
import { JwtDecodedService } from '../../../core/services/jwt-decoded.service';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <button mat-icon-button (click)="sidenav.toggle()" class="menu-btn">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="toolbar-title">
        <mat-icon class="toolbar-logo">admin_panel_settings</mat-icon>
        ControlFit
      </span>
      <span class="toolbar-subtitle">Super Administrador</span>
      <span class="spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="menu" class="user-menu-btn" aria-label="Menú de usuario">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <div class="user-menu-header">
          <div class="user-avatar">{{ inicial }}</div>
          <div>
            <div class="user-name">Super Admin</div>
            <div class="user-role">{{ userEmail }}</div>
          </div>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()" class="logout-menu-item">
          <mat-icon>logout</mat-icon>
          <span>Cerrar sesión</span>
        </button>
      </mat-menu>
    </mat-toolbar>
    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <div class="sidenav-avatar">{{ inicial }}</div>
          <div class="sidenav-user-name">Super Admin</div>
          <div class="sidenav-user-role">Control Total</div>
        </div>
        <mat-nav-list class="sidenav-nav">
          <a mat-list-item routerLink="/super-admin/dashboard" routerLinkActive="active-link">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/super-admin/gimnasios" routerLinkActive="active-link">
            <mat-icon>business</mat-icon>
            <span>Gimnasios</span>
          </a>
          <a mat-list-item routerLink="/super-admin/configuracion" routerLinkActive="active-link">
            <mat-icon>settings</mat-icon>
            <span>Configuración</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <div class="content fade-in">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .toolbar-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    .toolbar-logo {
      font-size: 28px;
      height: 28px;
      width: 28px;
    }
    .toolbar-subtitle {
      margin-left: 12px;
      font-size: 14px;
      opacity: 0.8;
      font-weight: 300;
    }
    .menu-btn { margin-right: 8px; }
    .user-btn { margin-left: 8px; }
    .spacer { flex: 1 1 auto; }
    mat-sidenav-container {
      height: calc(100vh - 64px);
      background: #f5f7fa;
    }
    .sidenav {
      width: 260px;
      border-right: none;
      background: #ffffff;
    }
    .sidenav-header {
      padding: 24px 20px;
      text-align: center;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 8px;
    }
    .sidenav-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 600;
      margin: 0 auto 12px;
    }
    .sidenav-user-name {
      font-size: 16px;
      font-weight: 500;
      color: #0f172a;
    }
    .sidenav-user-role {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    .sidenav-nav a[mat-list-item] {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 48px;
      margin: 2px 8px;
      border-radius: 8px;
      font-size: 14px;
      color: #475569;
    }
    .sidenav-nav a[mat-list-item]:hover { background: #f1f5f9; }
    .sidenav-nav a[mat-list-item] mat-icon { margin-right: 12px; color: #64748b; }
    .sidenav-nav a.active-link mat-icon { color: #1a237e; }
    .content {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .user-info-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      min-width: 220px;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #1a237e;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
    }
    .user-name { font-size: 14px; font-weight: 500; }
    .user-role { font-size: 12px; color: #64748b; }
    @media (max-width: 768px) {
      .sidenav { width: 240px; }
      .content { padding: 16px; }
      .toolbar-subtitle { display: none; }
    }
  `]
})
export class SuperAdminLayoutComponent {
  userEmail = '';
  inicial = 'S';

  constructor(
    private tokenService: TokenService,
    private jwtDecodedService: JwtDecodedService,
    private router: Router
  ) {
    this.userEmail = this.jwtDecodedService.getEmail() || '';
    this.inicial = 'S';
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/']);
  }
}
