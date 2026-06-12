import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
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
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar app-toolbar--platform">
      <button mat-icon-button (click)="sidenav.toggle()" aria-label="Abrir menú">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="app-toolbar-title">
        <mat-icon class="app-toolbar-logo">admin_panel_settings</mat-icon>
        CossGym
      </span>
      <span class="app-toolbar-subtitle">Plataforma</span>
      <span class="spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="menu" class="user-menu-btn" aria-label="Menú de usuario">
        <mat-icon>account_circle</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <div class="user-menu-header">
          <div class="user-avatar">{{ inicial }}</div>
          <div>
            <div class="user-name">Super Administrador</div>
            <div class="user-role">{{ userEmail }}</div>
          </div>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()" class="logout-menu-item">
          <mat-icon matMenuItemIcon>logout</mat-icon>
          <span matMenuItemTitle>Cerrar sesión</span>
        </button>
      </mat-menu>
    </mat-toolbar>

    <mat-sidenav-container class="app-shell-container">
      <mat-sidenav #sidenav [mode]="sidenavMode" [opened]="sidenavOpened" class="app-sidenav">
        <div class="app-sidenav-header">
          <div class="app-sidenav-avatar">{{ inicial }}</div>
          <div class="app-sidenav-user-name">Super Admin</div>
          <div class="app-sidenav-user-role">Control de plataforma</div>
        </div>
        <mat-nav-list class="app-sidenav-nav">
          <a mat-list-item routerLink="/super-admin/dashboard" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/super-admin/gimnasios" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon>business</mat-icon>
            <span matListItemTitle>Gimnasios</span>
          </a>
          <a mat-list-item routerLink="/super-admin/configuracion" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Configuración</span>
          </a>
          <a mat-list-item routerLink="/super-admin/auditoria" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon>history</mat-icon>
            <span matListItemTitle>Auditoría</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <div class="app-content fade-in">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .user-name { font-size: 14px; font-weight: 600; }
    .user-role { font-size: 12px; color: var(--text-muted); }
  `]
})
export class SuperAdminLayoutComponent {
  userEmail = '';
  inicial = 'S';
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor(
    private tokenService: TokenService,
    private jwtDecodedService: JwtDecodedService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.userEmail = this.jwtDecodedService.getEmail() || '';
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).subscribe(result => {
      this.sidenavMode = result.matches ? 'over' : 'side';
      this.sidenavOpened = !result.matches;
    });
  }

  closeSidenavIfMobile(sidenav: MatSidenav): void {
    if (this.sidenavMode === 'over') sidenav.close();
  }

  logout(): void {
    this.tokenService.clearAll();
    this.router.navigate(['/']);
  }
}
