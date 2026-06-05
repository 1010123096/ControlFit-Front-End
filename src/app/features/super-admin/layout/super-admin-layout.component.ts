import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TokenService } from '../../../core/services/token.service';
import { JwtDecodedService } from '../../../core/services/jwt-decoded.service';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span>Super Administrador</span>
      <span class="spacer"></span>
      <button mat-button (click)="logout()">
        <mat-icon>logout</mat-icon>
        Cerrar sesión
      </button>
    </mat-toolbar>
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
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
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .toolbar { position: sticky; top: 0; z-index: 1000; }
    .spacer { flex: 1 1 auto; }
    mat-sidenav-container { height: calc(100vh - 64px); }
    mat-sidenav { width: 250px; padding-top: 8px; }
    .content { padding: 24px; }
    a[mat-list-item] { display: flex; align-items: center; gap: 8px; }
    a[mat-list-item] mat-icon { margin-right: 8px; }
    .active-link { background: rgba(63, 81, 181, 0.15); }
  `]
})
export class SuperAdminLayoutComponent {
  constructor(
    private tokenService: TokenService,
    private jwtDecodedService: JwtDecodedService,
    private router: Router
  ) {}

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/']);
  }
}
