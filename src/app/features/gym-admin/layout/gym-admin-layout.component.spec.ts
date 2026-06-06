import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GymAdminLayoutComponent } from './gym-admin-layout.component';
import { TokenService } from '../../../core/services/token.service';
import { JwtDecodedService } from '../../../core/services/jwt-decoded.service';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GymAdminLayoutComponent', () => {
  let component: GymAdminLayoutComponent;
  let fixture: ComponentFixture<GymAdminLayoutComponent>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let jwtDecodedService: jasmine.SpyObj<JwtDecodedService>;

  beforeEach(async () => {
    tokenService = jasmine.createSpyObj('TokenService', ['clearToken']);
    jwtDecodedService = jasmine.createSpyObj('JwtDecodedService', ['getNombreGimnasio', 'getEmail']);

    jwtDecodedService.getNombreGimnasio.and.returnValue('FitZone');
    jwtDecodedService.getEmail.and.returnValue('admin@fitzone.com');

    await TestBed.configureTestingModule({
      imports: [GymAdminLayoutComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: TokenService, useValue: tokenService },
        { provide: JwtDecodedService, useValue: jwtDecodedService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GymAdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display gym name from JWT', () => {
    expect(component.nombreGimnasio).toBe('FitZone');
    expect(component.userEmail).toBe('admin@fitzone.com');
    expect(component.inicial).toBe('F');
  });

  it('should fallback to "Gimnasio" when no gym name', () => {
    jwtDecodedService.getNombreGimnasio.and.returnValue(null);
    const comp = TestBed.createComponent(GymAdminLayoutComponent).componentInstance;
    expect(comp.nombreGimnasio).toBe('Gimnasio');
  });

  it('should render toolbar with gym name', () => {
    const toolbar = fixture.nativeElement.querySelector('.toolbar-subtitle');
    expect(toolbar).toBeTruthy();
    expect(toolbar.textContent).toContain('FitZone');
  });

  it('should logout and clear token', () => {
    component.logout();
    expect(tokenService.clearToken).toHaveBeenCalled();
  });

  it('should have navigation links', () => {
    const navLinks = fixture.nativeElement.querySelectorAll('a[mat-list-item]');
    expect(navLinks.length).toBe(5);
  });
});
