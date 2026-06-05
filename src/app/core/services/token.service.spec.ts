import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve token', () => {
    service.setToken('test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('should clear token', () => {
    service.setToken('test-token');
    service.clearToken();
    expect(service.getToken()).toBeNull();
  });

  it('should check token existence', () => {
    expect(service.hasToken()).toBeFalse();
    service.setToken('test-token');
    expect(service.hasToken()).toBeTrue();
  });
});
