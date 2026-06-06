import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HistorialService } from './historial.service';
import { environment } from '../../../../../environments/environment';

describe('HistorialService', () => {
  let service: HistorialService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HistorialService],
    });
    service = TestBed.inject(HistorialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all historial', () => {
    const mock = [{ id: 1, miembroId: 1, accion: 'Crear miembro', fecha: '2024-01-01', detalle: 'Se creó un nuevo miembro' }];
    service.obtenerTodos().subscribe((res) => expect(res).toEqual(mock));
    const req = httpMock.expectOne(`${environment.apiUrl}/Historial`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
