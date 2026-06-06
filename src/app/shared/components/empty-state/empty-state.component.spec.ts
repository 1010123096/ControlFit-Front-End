import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.message).toBe('No hay datos disponibles');
    expect(component.submessage).toBe('');
    expect(component.icon).toBe('info');
  });

  it('should display custom message', () => {
    component.message = 'Custom message';
    component.submessage = 'Custom sub';
    component.icon = 'search_off';
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.textContent).toContain('Custom message');
    expect(el.textContent).toContain('Custom sub');
    expect(el.querySelector('mat-icon')?.textContent).toContain('search_off');
  });
});
