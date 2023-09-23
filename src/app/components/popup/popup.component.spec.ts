import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;

  const dialogMock = {
    close: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PopupComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogMock
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass yes on click of yes button', () => {
    component.onYes();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  it('should pass no on click of no button', () => {
    component.onNo();
    expect(dialogMock.close).toHaveBeenCalled();
  });
});
