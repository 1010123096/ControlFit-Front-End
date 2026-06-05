import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { JwtDecodedService } from '../../../../core/services/jwt-decoded.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['hasToken', 'setToken']);
    const jwtSpy = jasmine.createSpyObj('JwtDecodedService', ['isTokenExpired', 'getRole']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showSuccess']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    tokenServiceSpy.hasToken.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: JwtDecodedService, useValue: jwtSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
