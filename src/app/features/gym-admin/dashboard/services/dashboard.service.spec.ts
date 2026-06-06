import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { environment } from '../../../../../environments/environment';

describe('DashboardService (Gym Admin)', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), DashboardService],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch gym admin dashboard stats', () => {
    const mock = { totalMiembros: 10, miembrosActivos: 8, membresiasVencidas: 2, asistenciasHoy: 5 };
    service.getStats().subscribe((res) => expect(res).toEqual(mock));
    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/gym-admin`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should handle error', () => {
    service.getStats().subscribe({ error: (err) => expect(err.status).toBe(500) });
    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/gym-admin`);
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });
});
