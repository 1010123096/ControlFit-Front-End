import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../../shared/services/notification.service';
import { HttpClient } from '@angular/common/http';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationService = jasmine.createSpyObj('NotificationService', ['showError']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationService },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => httpMock.verify());

  it('should show error message on 401', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/api/test');
    req.flush({ mensaje: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    expect(notificationService.showError).toHaveBeenCalledWith('CREDENCIALES INVALIDAS');
  });

  it('should show error message on 403', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 403, statusText: 'Forbidden' });
    expect(notificationService.showError).toHaveBeenCalledWith('No tienes permisos para realizar esta acción');
  });

  it('should show error message on 500', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 500, statusText: 'Server Error' });
    expect(notificationService.showError).toHaveBeenCalledWith('Error interno del servidor');
  });

  it('should show custom mensaje from error body', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/api/test');
    req.flush({ mensaje: 'Custom error' }, { status: 422, statusText: 'Unprocessable' });
    expect(notificationService.showError).toHaveBeenCalledWith('Custom error');
  });

  it('should fallback to generic error message', () => {
    http.get('/api/test').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 0, statusText: 'Unknown Error' });
    expect(notificationService.showError).toHaveBeenCalledWith('Ha ocurrido un error inesperado');
  });
});
