import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.message).toBe('Ha ocurrido un error');
    expect(component.detail).toBe('');
    expect(component.showRetry).toBeTrue();
  });

  it('should display custom message and detail', () => {
    component.message = 'Not found';
    component.detail = 'Resource missing';
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.textContent).toContain('Not found');
    expect(el.textContent).toContain('Resource missing');
  });

  it('should not show retry button when showRetry is false', () => {
    component.showRetry = false;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeNull();
  });

  it('should emit retry event on button click', () => {
    spyOn(component.retry, 'emit');
    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(component.retry.emit).toHaveBeenCalled();
  });
});
