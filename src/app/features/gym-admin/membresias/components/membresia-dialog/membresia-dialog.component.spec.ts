import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembresiaDialogComponent } from './membresia-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MembresiaService } from '../../services/membresia.service';
import { JwtDecodedService } from '../../../../../core/services/jwt-decoded.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('MembresiaDialogComponent', () => {
  let component: MembresiaDialogComponent;
  let fixture: ComponentFixture<MembresiaDialogComponent>;
  let service: jasmine.SpyObj<MembresiaService>;
  let jwtDecodedService: jasmine.SpyObj<JwtDecodedService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<MembresiaDialogComponent>>;

  const mockMembresia = { id: 1, nombre: 'Premium', duracionDias: 30, precio: 500, estado: true, gimnasioId: 5, maximoIngresosPorDia: 0, maximoIngresosPorSemana: 0, maximoIngresosTotales: 0 };

  beforeEach(async () => {
    service = jasmine.createSpyObj('MembresiaService', ['crear', 'actualizar']);
    jwtDecodedService = jasmine.createSpyObj('JwtDecodedService', ['getGimnasioId']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    jwtDecodedService.getGimnasioId.and.returnValue(5);

    await TestBed.configureTestingModule({
      imports: [MembresiaDialogComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: MembresiaService, useValue: service },
        { provide: JwtDecodedService, useValue: jwtDecodedService },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
  });

  describe('create mode', () => {
    beforeEach(() => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
      fixture = TestBed.createComponent(MembresiaDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create with empty form', () => {
      expect(component).toBeTruthy();
      expect(component.data).toBeNull();
    });

    it('should call crear on guardar', () => {
      service.crear.and.returnValue(of({ id: 2 }));
      component.form.setValue({ nombre: 'Basic', duracionDias: 15, precio: 200, maximoIngresosPorDia: 0, maximoIngresosPorSemana: 0, maximoIngresosTotales: 0 });
      component.guardar();
      expect(service.crear).toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not call crear on invalid form', () => {
      component.guardar();
      expect(service.crear).not.toHaveBeenCalled();
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockMembresia });
      fixture = TestBed.createComponent(MembresiaDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should prefill form with data', () => {
      expect(component.data).toEqual(mockMembresia);
      expect(component.form.get('nombre')?.value).toBe('Premium');
    });

    it('should call actualizar on guardar in edit mode', () => {
      service.actualizar.and.returnValue(of({}));
      component.guardar();
      expect(service.actualizar).toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });
  });
});
