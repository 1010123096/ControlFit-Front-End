import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { JwtDecodedService } from '../../../../core/services/jwt-decoded.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm;
  loading = false;
  hidePassword = true;
  isProduction = environment.production;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private jwtDecodedService: JwtDecodedService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
    if (this.tokenService.hasToken() && !this.jwtDecodedService.isTokenExpired()) {
      this.redirectByRole();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    const { correo, contrasena } = this.loginForm.value;
    this.authService.login(correo!, contrasena!).subscribe({
      next: (response) => {
        this.tokenService.setToken(response.token);
        if (response.refreshToken) {
          this.tokenService.setRefreshToken(response.refreshToken);
        }
        this.notificationService.showSuccess('Inicio de sesión exitoso');
        this.redirectByRole();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private redirectByRole(): void {
    const role = this.jwtDecodedService.getRole();
    if (role === 'Super Admin') {
      this.router.navigate(['/super-admin/dashboard']);
    } else {
      this.router.navigate(['/gym-admin/dashboard']);
    }
  }
}
