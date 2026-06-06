import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperAdminLayoutComponent } from './super-admin-layout.component';
import { TokenService } from '../../../core/services/token.service';
import { JwtDecodedService } from '../../../core/services/jwt-decoded.service';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SuperAdminLayoutComponent', () => {
  let component: SuperAdminLayoutComponent;
  let fixture: ComponentFixture<SuperAdminLayoutComponent>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let jwtDecodedService: jasmine.SpyObj<JwtDecodedService>;

  beforeEach(async () => {
    tokenService = jasmine.createSpyObj('TokenService', ['clearToken']);
    jwtDecodedService = jasmine.createSpyObj('JwtDecodedService', ['getEmail']);

    jwtDecodedService.getEmail.and.returnValue('super@controlfit.com');

    await TestBed.configureTestingModule({
      imports: [SuperAdminLayoutComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: TokenService, useValue: tokenService },
        { provide: JwtDecodedService, useValue: jwtDecodedService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user email from JWT', () => {
    expect(component.userEmail).toBe('super@controlfit.com');
    expect(component.inicial).toBe('S');
  });

  it('should show fallback email when not found', () => {
    jwtDecodedService.getEmail.and.returnValue(null);
    const comp = TestBed.createComponent(SuperAdminLayoutComponent).componentInstance;
    expect(comp.userEmail).toBe('');
  });

  it('should logout and clear token', () => {
    component.logout();
    expect(tokenService.clearToken).toHaveBeenCalled();
  });

  it('should have navigation links', () => {
    const navLinks = fixture.nativeElement.querySelectorAll('a[mat-list-item]');
    expect(navLinks.length).toBe(3);
  });

  it('should render toolbar with Super Administrador text', () => {
    const toolbarText = fixture.nativeElement.querySelector('.toolbar-subtitle');
    expect(toolbarText).toBeTruthy();
    expect(toolbarText.textContent).toContain('Super Administrador');
  });
});
