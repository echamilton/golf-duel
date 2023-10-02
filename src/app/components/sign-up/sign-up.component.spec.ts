import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SignUpComponent } from './sign-up.component';

xdescribe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  const authServiceMock = {
    signup: jest.fn(() => Promise.resolve())
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [
        MatDialogModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: () => of()
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sign up correctly with credentials', () => {
    component.signup();
    expect(component.authService.signup).toHaveBeenCalled();
  });

  it('should sign up incorrectly as user already exists', () => {
    component.signup();
    // expect(component.authService.signup).toHaveBeenCalled();
    expect(component.authService.signup).rejects.toBeCalled();
  });

  it('should launch the snackbar correctly', () => {
    const message = 'This is my message';
    component.openSnackBar(message);
    // expect(component.)
  });
});
