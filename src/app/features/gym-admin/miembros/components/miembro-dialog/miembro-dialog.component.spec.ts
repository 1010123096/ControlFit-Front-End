import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembroDialogComponent } from './miembro-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MiembroService } from '../../services/miembro.service';
import { JwtDecodedService } from '../../../../../core/services/jwt-decoded.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('MiembroDialogComponent', () => {
  let component: MiembroDialogComponent;
  let fixture: ComponentFixture<MiembroDialogComponent>;
  let miembroService: jasmine.SpyObj<MiembroService>;
  let jwtDecodedService: jasmine.SpyObj<JwtDecodedService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<MiembroDialogComponent>>;

  const mockMiembro = { id: 1, nombreCompleto: 'Juan Perez', correo: 'juan@test.com', telefono: '123456789', gimnasioId: 5 };

  beforeEach(async () => {
    miembroService = jasmine.createSpyObj('MiembroService', ['crear', 'actualizar']);
    jwtDecodedService = jasmine.createSpyObj('JwtDecodedService', ['getGimnasioId']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    jwtDecodedService.getGimnasioId.and.returnValue(5);

    await TestBed.configureTestingModule({
      imports: [MiembroDialogComponent, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: MiembroService, useValue: miembroService },
        { provide: JwtDecodedService, useValue: jwtDecodedService },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
  });

  describe('create mode', () => {
    beforeEach(() => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
      fixture = TestBed.createComponent(MiembroDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create with empty form', () => {
      expect(component).toBeTruthy();
      expect(component.data).toBeNull();
      expect(component.miembroForm.get('nombreCompleto')?.value).toBe('');
    });

    it('should call crear on guardar', () => {
      miembroService.crear.and.returnValue(of({ id: 2 }));
      component.miembroForm.setValue({ nombreCompleto: 'Ana', correo: 'ana@test.com', telefono: '987654321' });
      component.guardar();
      expect(miembroService.crear).toHaveBeenCalledWith({ nombreCompleto: 'Ana', correo: 'ana@test.com', telefono: '987654321', gimnasioId: 5 });
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should not call crear on invalid form', () => {
      component.guardar();
      expect(miembroService.crear).not.toHaveBeenCalled();
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: mockMiembro });
      fixture = TestBed.createComponent(MiembroDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should prefill form with data', () => {
      expect(component.data).toEqual(mockMiembro);
      expect(component.miembroForm.get('nombreCompleto')?.value).toBe('Juan Perez');
      expect(component.miembroForm.get('correo')?.value).toBe('juan@test.com');
    });

    it('should call actualizar on guardar in edit mode', () => {
      miembroService.actualizar.and.returnValue(of({}));
      component.guardar();
      expect(miembroService.actualizar).toHaveBeenCalledWith({ id: 1, nombreCompleto: 'Juan Perez', correo: 'juan@test.com', telefono: '123456789' });
      expect(dialogRef.close).toHaveBeenCalledWith(true);
    });
  });
});
