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
  selector: 'app-gym-admin-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule,
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="sidenav.toggle()" aria-label="Abrir menú de navegación">
        <mat-icon aria-hidden="true">menu</mat-icon>
      </button>
      <span class="app-toolbar-title">
        <mat-icon class="app-toolbar-logo" aria-hidden="true">fitness_center</mat-icon>
        CossGym
      </span>
      <span class="app-toolbar-subtitle">{{ nombreGimnasio }}</span>
      <span class="spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="menu" class="user-menu-btn" aria-label="Menú de usuario">
        <mat-icon aria-hidden="true">account_circle</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <div class="user-menu-header">
          <div class="user-avatar">{{ inicial }}</div>
          <div>
            <div class="user-name">{{ nombreGimnasio }}</div>
            <div class="user-role">{{ userEmail }}</div>
          </div>
        </div>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()" class="logout-menu-item">
          <mat-icon matMenuItemIcon aria-hidden="true">logout</mat-icon>
          <span matMenuItemTitle>Cerrar sesión</span>
        </button>
      </mat-menu>
    </mat-toolbar>

    <mat-sidenav-container class="app-shell-container">
      <mat-sidenav #sidenav [mode]="sidenavMode" [opened]="sidenavOpened" class="app-sidenav">
        <div class="app-sidenav-header">
          <div class="app-sidenav-avatar">{{ inicial }}</div>
          <div class="app-sidenav-user-name">{{ nombreGimnasio }}</div>
          <div class="app-sidenav-user-role">Administrador</div>
        </div>

        <div class="app-sidenav-quick">
          <button mat-flat-button color="primary" routerLink="/gym-admin/asistencias/registrar" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon>how_to_reg</mat-icon>
            Registrar asistencia
          </button>
        </div>

        <mat-nav-list class="app-sidenav-nav">
          <a mat-list-item routerLink="/gym-admin/dashboard" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon aria-hidden="true">dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/gym-admin/miembros" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon aria-hidden="true">people</mat-icon>
            <span matListItemTitle>Miembros</span>
          </a>
          <a mat-list-item routerLink="/gym-admin/membresias" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon aria-hidden="true">card_membership</mat-icon>
            <span matListItemTitle>Membresías</span>
          </a>
          <a mat-list-item routerLink="/gym-admin/asignaciones" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon aria-hidden="true">assignment</mat-icon>
            <span matListItemTitle>Asignaciones</span>
          </a>
          <a mat-list-item routerLink="/gym-admin/asistencias" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon aria-hidden="true">how_to_reg</mat-icon>
            <span matListItemTitle>Asistencias</span>
          </a>
          <a mat-list-item routerLink="/gym-admin/historial" routerLinkActive="active-link" (click)="closeSidenavIfMobile(sidenav)">
            <mat-icon matListItemIcon aria-hidden="true">history</mat-icon>
            <span matListItemTitle>Historial</span>
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
export class GymAdminLayoutComponent {
  nombreGimnasio = '';
  userEmail = '';
  inicial = 'G';
  sidenavMode: 'side' | 'over' = 'side';
  sidenavOpened = true;

  constructor(
    private tokenService: TokenService,
    private jwtDecodedService: JwtDecodedService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.nombreGimnasio = this.jwtDecodedService.getNombreGimnasio() || 'Mi Gimnasio';
    this.userEmail = this.jwtDecodedService.getEmail() || '';
    this.inicial = this.nombreGimnasio.charAt(0).toUpperCase();

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
