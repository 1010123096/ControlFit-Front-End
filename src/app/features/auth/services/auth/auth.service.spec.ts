import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should send login POST request', () => {
    const mockResponse = { mensaje: 'OK', token: 'abc123' };
    service.login('test@test.com', '123456').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ correo: 'test@test.com', contrasena: '123456' });
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    service.login('bad@test.com', 'wrong').subscribe({
      error: (err) => expect(err.status).toBe(401),
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ mensaje: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });
});
