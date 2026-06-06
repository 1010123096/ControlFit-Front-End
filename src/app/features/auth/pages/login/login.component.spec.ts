import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { JwtDecodedService } from '../../../../core/services/jwt-decoded.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let jwtDecodedService: jasmine.SpyObj<JwtDecodedService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    tokenService = jasmine.createSpyObj('TokenService', ['hasToken', 'setToken']);
    jwtDecodedService = jasmine.createSpyObj('JwtDecodedService', ['isTokenExpired', 'getRole']);
    notificationService = jasmine.createSpyObj('NotificationService', ['showSuccess']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    tokenService.hasToken.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: TokenService, useValue: tokenService },
        { provide: JwtDecodedService, useValue: jwtDecodedService },
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should be valid with correct inputs', () => {
    component.loginForm.setValue({ correo: 'test@test.com', contrasena: '123456' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should not redirect when no existing token', () => {
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should redirect if token exists and not expired', () => {
    tokenService.hasToken.and.returnValue(true);
    jwtDecodedService.isTokenExpired.and.returnValue(false);
    jwtDecodedService.getRole.and.returnValue('Super Admin');
    const comp = TestBed.createComponent(LoginComponent).componentInstance;
    expect(router.navigate).toHaveBeenCalledWith(['/super-admin/dashboard']);
  });

  it('should call authService on submit and redirect gym admin', () => {
    authService.login.and.returnValue(of({ mensaje: 'OK', token: 'token123' }));
    jwtDecodedService.getRole.and.returnValue('Admin Gimnasio');

    component.loginForm.setValue({ correo: 'admin@test.com', contrasena: '123456' });
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('admin@test.com', '123456');
    expect(tokenService.setToken).toHaveBeenCalledWith('token123');
    expect(notificationService.showSuccess).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/gym-admin/dashboard']);
  });

  it('should handle login error and reset loading', () => {
    authService.login.and.returnValue(throwError(() => new Error('Login failed')));
    component.loginForm.setValue({ correo: 'bad@test.com', contrasena: '123456' });
    component.onSubmit();
    expect(component.loading).toBeFalse();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTrue();
    component.hidePassword = !component.hidePassword;
    expect(component.hidePassword).toBeFalse();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should redirect Super Admin to correct dashboard', () => {
    tokenService.hasToken.and.returnValue(true);
    jwtDecodedService.isTokenExpired.and.returnValue(false);
    jwtDecodedService.getRole.and.returnValue('Super Admin');
    const comp = TestBed.createComponent(LoginComponent).componentInstance;
    expect(router.navigate).toHaveBeenCalledWith(['/super-admin/dashboard']);
  });
});
