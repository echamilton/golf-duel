import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PwdResetComponent } from './pwd-reset.component';
import { AuthService } from './../../services/auth.service';

describe('PwdResetComponent', () => {
  let component: PwdResetComponent;
  let fixture: ComponentFixture<PwdResetComponent>;

  const authServiceMock = {
    resetPassword: jest.fn()
  };

  const routerMock = {
    navigate: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatFormFieldModule],
      declarations: [PwdResetComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwdResetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the request for password and nav back to dashboard', () => {
    component.emailAddress = '1234@1234.com';

    component.submitPwdReset();
    expect(authServiceMock.resetPassword).toHaveBeenCalledWith('1234@1234.com');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/leader']);
  });
});
