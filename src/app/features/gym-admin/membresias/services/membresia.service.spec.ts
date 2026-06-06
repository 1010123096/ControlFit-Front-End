import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MembresiaService } from './membresia.service';
import { responseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { Membresia } from '../models/membresia.model';

describe('MembresiaService', () => {
  let service: MembresiaService;
  let httpMock: HttpTestingController;

  const mockMembresia: Membresia = {
    id: 1,
    nombre: 'Mensual',
    duracionDias: 30,
    precio: 50,
    estado: true,
    gimnasioId: 1,
    maximoIngresosPorDia: 2,
    maximoIngresosPorSemana: 10,
    maximoIngresosTotales: 30,
  };

  const wrappedResponse = { message: 'ok', data: mockMembresia };
  const listResponse = { message: 'ok', data: [mockMembresia], total: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([responseInterceptor])),
        provideHttpClientTesting(),
        MembresiaService,
      ],
    });
    service = TestBed.inject(MembresiaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all memberships', () => {
    service.obtenerTodas().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].nombre).toBe('Mensual');
    });
    const req = httpMock.expectOne('http://localhost:5219/api/Membresia');
    expect(req.request.method).toBe('GET');
    req.flush(listResponse);
  });

  it('should create a membership', () => {
    const dto = {
      nombre: 'Nueva',
      duracionDias: 15,
      precio: 30,
      maximoIngresosPorDia: 1,
      maximoIngresosPorSemana: 5,
      maximoIngresosTotales: 15,
      gimnasioId: 1,
    };
    service.crear(dto).subscribe(res => {
      expect(res).toEqual(mockMembresia);
    });
    const req = httpMock.expectOne('http://localhost:5219/api/Membresia');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(wrappedResponse);
  });

  it('should update a membership', () => {
    const partial = { nombre: 'Actualizado' };
    service.actualizar(1, partial).subscribe(res => {
      expect(res).toEqual(mockMembresia);
    });
    const req = httpMock.expectOne('http://localhost:5219/api/Membresia/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(partial);
    req.flush(wrappedResponse);
  });

  it('should delete a membership', () => {
    service.eliminar(1).subscribe(res => {
      expect(res).toEqual({ message: 'Eliminado' });
    });
    const req = httpMock.expectOne('http://localhost:5219/api/Membresia/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Eliminado' });
  });
});
