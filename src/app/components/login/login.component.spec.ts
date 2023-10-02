import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './login.component';
import { AuthService } from './../../services/auth.service';
import { GolfStoreFacade } from './../../store/golf.store.facade';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authServiceMock = {
    logout: jest.fn()
  };

  const routerMock = {
    navigate: jest.fn()
  };

  const facadeMock = {
    navigate: jest.fn()
  };

  const snackbarMock = {
    open: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [MatSnackBarModule, MatCardModule, MatFormFieldModule],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: MatSnackBar,
          useValue: snackbarMock
        },
        { provide: GolfStoreFacade, useValue: facadeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to password reset component', () => {
    component.forgotPassword();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/reset']);
  });

  it('should log the user out', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should launch the snackbar message', () => {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    component.openSnackBar('message1234');
    expect(snackbarMock.open).toHaveBeenCalledWith(
      'message1234',
      'Close',
      config
    );
  });
});
