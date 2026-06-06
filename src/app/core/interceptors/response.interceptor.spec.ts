import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { responseInterceptor } from './response.interceptor';
import { of, throwError } from 'rxjs';

describe('ResponseInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([responseInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should unwrap data property from response', (done) => {
    http.get('/api/test').subscribe(res => {
      expect(res).toEqual({ id: 1, name: 'test' });
      done();
    });
    httpMock.expectOne('/api/test').flush({ message: 'ok', data: { id: 1, name: 'test' } });
  });

  it('should handle array response with total', (done) => {
    http.get('/api/list').subscribe(res => {
      expect(res).toEqual([{ id: 1 }, { id: 2 }]);
      done();
    });
    httpMock.expectOne('/api/list').flush({ message: 'ok', data: [{ id: 1 }, { id: 2 }], total: 2 });
  });

  it('should pass through response without data property', (done) => {
    http.get('/api/plain').subscribe(res => {
      expect(res).toEqual({ mensaje: 'Login exitoso', token: 'jwt' });
      done();
    });
    httpMock.expectOne('/api/plain').flush({ mensaje: 'Login exitoso', token: 'jwt' });
  });

  it('should pass through errors', (done) => {
    http.get('/api/error').subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(404);
        done();
      }
    });
    httpMock.expectOne('/api/error').flush({ error: 'Not found' }, { status: 404, statusText: 'Not Found' });
  });
});
