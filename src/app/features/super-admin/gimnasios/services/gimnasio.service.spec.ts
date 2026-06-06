import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GimnasioService } from './gimnasio.service';
import { environment } from '../../../../../environments/environment';

describe('GimnasioService', () => {
  let service: GimnasioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), GimnasioService],
    });
    service = TestBed.inject(GimnasioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all gimnasios', () => {
    const mock = [{ id: 1, nombre: 'FitZone', direccion: 'Calle 1', telefono: '123', estado: true }];
    service.obtenerTodos().subscribe((res) => expect(res).toEqual(mock));
    const req = httpMock.expectOne(`${environment.apiUrl}/gimnasios/obtenerTodos`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should create gimnasio', () => {
    const data = { nombre: 'New Gym', direccion: 'Av 1', telefono: '456' };
    service.crear(data).subscribe((res) => expect(res).toEqual({ id: 2 }));
    const req = httpMock.expectOne(`${environment.apiUrl}/gimnasios/Registro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({ id: 2 });
  });

  it('should update gimnasio', () => {
    const data = { id: 1, nombre: 'Updated', direccion: 'St 2', telefono: '789' };
    service.actualizar(data).subscribe((res) => expect(res).toEqual({ id: 1 }));
    const req = httpMock.expectOne(`${environment.apiUrl}/gimnasios/actualizar`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(data);
    req.flush({ id: 1 });
  });

  it('should delete gimnasio', () => {
    service.eliminar(3).subscribe((res) => expect(res).toBeNull());
    const req = httpMock.expectOne(`${environment.apiUrl}/gimnasios/eliminar?id=3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
