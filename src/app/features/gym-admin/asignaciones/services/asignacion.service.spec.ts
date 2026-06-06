import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AsignacionService } from './asignacion.service';
import { environment } from '../../../../../environments/environment';

describe('AsignacionService', () => {
  let service: AsignacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AsignacionService],
    });
    service = TestBed.inject(AsignacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all asignaciones', () => {
    const mock = [{ id: 1, miembroId: 1, membresiaId: 1, gimnasioId: 1, fechaInicio: '2024-01-01', fechaFin: '2024-02-01', estado: 'Activo' }];
    service.obtenerTodas().subscribe((res) => expect(res).toEqual(mock));
    const req = httpMock.expectOne(`${environment.apiUrl}/asignacion`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should create asignacion', () => {
    const data = { miembroId: 1, membresiaId: 1 };
    service.crear(data).subscribe((res) => expect(res).toEqual({ id: 1 }));
    const req = httpMock.expectOne(`${environment.apiUrl}/asignacion`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({ id: 1 });
  });

  it('should delete asignacion', () => {
    service.eliminar(5).subscribe((res) => expect(res).toBeNull());
    const req = httpMock.expectOne(`${environment.apiUrl}/asignacion/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
