import { TestBed } from '@angular/core/testing';
import { JwtDecodedService } from './jwt-decoded.service';
import { TokenService } from './token.service';

function createToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake-signature`;
}

describe('JwtDecodedService', () => {
  let service: JwtDecodedService;
  let tokenService: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    tokenService = jasmine.createSpyObj('TokenService', ['getToken']);
    TestBed.configureTestingModule({
      providers: [
        JwtDecodedService,
        { provide: TokenService, useValue: tokenService },
      ],
    });
    service = TestBed.inject(JwtDecodedService);
  });

  it('should return null when no token', () => {
    tokenService.getToken.and.returnValue(null);
    expect(service.getDecodedToken()).toBeNull();
    expect(service.getRole()).toBeNull();
    expect(service.getEmail()).toBeNull();
  });

  it('should decode Super Admin token', () => {
    tokenService.getToken.and.returnValue(createToken({
      sub: '1',
      email: 'admin@test.com',
      role: 'Super Admin',
      GimnasioId: 0,
      nombreGimnasio: null,
    }));
    expect(service.getRole()).toBe('Super Admin');
    expect(service.getEmail()).toBe('admin@test.com');
    expect(service.getGimnasioId()).toBe(0);
    expect(service.isSuperAdmin()).toBeTrue();
    expect(service.isAdminGimnasio()).toBeFalse();
  });

  it('should decode Gym Admin token', () => {
    tokenService.getToken.and.returnValue(createToken({
      sub: '2',
      email: 'gym@test.com',
      role: 'Admin Gimnasio',
      GimnasioId: 5,
      nombreGimnasio: 'FitZone',
    }));
    expect(service.getRole()).toBe('Admin Gimnasio');
    expect(service.getEmail()).toBe('gym@test.com');
    expect(service.getGimnasioId()).toBe(5);
    expect(service.getNombreGimnasio()).toBe('FitZone');
    expect(service.isSuperAdmin()).toBeFalse();
    expect(service.isAdminGimnasio()).toBeTrue();
  });

  it('should detect expired token from exp claim', () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    tokenService.getToken.and.returnValue(createToken({ sub: '1', exp: past }));
    expect(service.isTokenExpired()).toBeTrue();
  });

  it('should detect valid token from exp claim', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    tokenService.getToken.and.returnValue(createToken({ sub: '1', exp: future }));
    expect(service.isTokenExpired()).toBeFalse();
  });

  it('should handle malformed token gracefully', () => {
    tokenService.getToken.and.returnValue('not-a-valid-token');
    expect(service.getDecodedToken()).toBeNull();
  });
});
