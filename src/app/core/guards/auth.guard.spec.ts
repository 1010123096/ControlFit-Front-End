import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { TokenService } from '../services/token.service';
import { JwtDecodedService } from '../services/jwt-decoded.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let tokenService: jasmine.SpyObj<TokenService>;
  let jwtDecodedService: jasmine.SpyObj<JwtDecodedService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    tokenService = jasmine.createSpyObj('TokenService', ['getToken', 'clearToken']);
    jwtDecodedService = jasmine.createSpyObj('JwtDecodedService', ['isTokenExpired']);
    router = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenService, useValue: tokenService },
        { provide: JwtDecodedService, useValue: jwtDecodedService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow activation with valid token', () => {
    tokenService.getToken.and.returnValue('valid-token');
    jwtDecodedService.isTokenExpired.and.returnValue(false);
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect to login when no token', () => {
    tokenService.getToken.and.returnValue(null);
    router.parseUrl.and.returnValue('/' as unknown as UrlTree);
    const result = guard.canActivate();
    expect(tokenService.clearToken).toHaveBeenCalled();
    expect(router.parseUrl).toHaveBeenCalledWith('/');
  });

  it('should redirect to login when token expired', () => {
    tokenService.getToken.and.returnValue('expired-token');
    jwtDecodedService.isTokenExpired.and.returnValue(true);
    router.parseUrl.and.returnValue('/' as unknown as UrlTree);
    const result = guard.canActivate();
    expect(tokenService.clearToken).toHaveBeenCalled();
    expect(router.parseUrl).toHaveBeenCalledWith('/');
  });
});
