import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SuperAdminDashboardService } from './dashboard.service';
import { environment } from '../../../../../environments/environment';

describe('SuperAdminDashboardService', () => {
  let service: SuperAdminDashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), SuperAdminDashboardService],
    });
    service = TestBed.inject(SuperAdminDashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch super admin dashboard stats', () => {
    const mock = { totalGimnasios: 3, totalMiembros: 50, totalAdministradores: 4 };
    service.getStats().subscribe((res) => expect(res).toEqual(mock));
    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/super-admin`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should handle error', () => {
    service.getStats().subscribe({ error: (err) => expect(err.status).toBe(500) });
    const req = httpMock.expectOne(`${environment.apiUrl}/dashboard/super-admin`);
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });
});
