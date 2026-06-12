import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AsistenciaService } from './asistencia.service';
import { environment } from '../../../../../environments/environment';

describe('AsistenciaService', () => {
  let service: AsistenciaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AsistenciaService],
    });
    service = TestBed.inject(AsistenciaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all asistencias', () => {
    const mock = [{ id: 1, miembroId: 1, fechaHoraAcceso: '2024-01-01T10:00:00' }];
    service.obtenerTodas().subscribe((res) => expect(res).toEqual(mock));
    const req = httpMock.expectOne(`${environment.apiUrl}/Asistencia`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mock, total: 1 });
  });

  it('should register asistencia', () => {
    const data = { miembroId: 1 };
    service.registrar(data).subscribe((res) => expect(res).toEqual({ id: 1 }));
    const req = httpMock.expectOne(`${environment.apiUrl}/Asistencia/registrar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({ id: 1 });
  });
});
