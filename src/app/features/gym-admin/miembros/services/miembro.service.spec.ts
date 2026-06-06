import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MiembroService } from './miembro.service';
import { responseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { Miembro, CrearMiembro, ActualizarMiembro } from '../models/miembro.model';

describe('MiembroService', () => {
  let service: MiembroService;
  let httpMock: HttpTestingController;

  const mockMiembro: Miembro = {
    id: 1,
    nombreCompleto: 'Juan Pérez',
    correo: 'juan@test.com',
    telefono: '123456789',
    gimnasioId: 1,
  };

  const wrappedResponse = { message: 'ok', data: mockMiembro };
  const listResponse = { message: 'ok', data: [mockMiembro], total: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([responseInterceptor])),
        provideHttpClientTesting(),
        MiembroService,
      ],
    });
    service = TestBed.inject(MiembroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all members', () => {
    service.obtenerTodos().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].nombreCompleto).toBe('Juan Pérez');
    });
    const req = httpMock.expectOne('http://localhost:5219/api/miembros/obtenerTodos');
    expect(req.request.method).toBe('GET');
    req.flush(listResponse);
  });

  it('should fetch member by id', () => {
    service.obtenerPorId(1).subscribe(res => {
      expect(res.nombreCompleto).toBe('Juan Pérez');
    });
    const req = httpMock.expectOne('http://localhost:5219/api/miembros/obtenerporID?id=1');
    expect(req.request.method).toBe('GET');
    req.flush(wrappedResponse);
  });

  it('should create a member', () => {
    const dto: CrearMiembro = {
      nombreCompleto: 'Nuevo',
      correo: 'nuevo@test.com',
      telefono: '987654321',
      gimnasioId: 1,
    };
    service.crear(dto).subscribe(res => {
      expect(res).toEqual(mockMiembro);
    });
    const req = httpMock.expectOne('http://localhost:5219/api/miembros/Registro');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(wrappedResponse);
  });

  it('should update a member', () => {
    const dto: ActualizarMiembro = { id: 1, nombreCompleto: 'Actualizado', correo: 'a@a.com', telefono: '111' };
    service.actualizar(dto).subscribe(res => {
      expect(res).toEqual(mockMiembro);
    });
    const req = httpMock.expectOne('http://localhost:5219/api/miembros/actualizar');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);
    req.flush(wrappedResponse);
  });

  it('should delete a member', () => {
    service.eliminar(1).subscribe();
    const req = httpMock.expectOne('http://localhost:5219/api/miembros/eliminar?id=1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Eliminado' });
  });
});
