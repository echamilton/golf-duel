import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { GolferPicksFormComponent } from './golfer-picks-form.component';

describe('GolferPicksComponent', () => {
  let component: GolferPicksFormComponent;
  let fixture: ComponentFixture<GolferPicksFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSelectModule],
      declarations: [GolferPicksFormComponent, MatFormField, MatLabel]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolferPicksFormComponent);
    component = fixture.componentInstance;

    component.picksFg = new UntypedFormGroup({
      golfer1: new UntypedFormControl('')
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check to see if golfer has already been selected for same golfer', () => {
    const currentGolferId = '1234';
    const golferIdDropdown = '1234';
    const result = component.checkGolferSelected(
      golferIdDropdown,
      currentGolferId
    );
    expect(result).toBeFalsy();
  });

  it('should check to see if golfer has not already been selected for different golfer', () => {
    const currentGolferId = '1234';
    const golferIdDropdown = '1235';

    component.picksFg.setValue({
      golfer1: '1236'
    });

    const result = component.checkGolferSelected(
      golferIdDropdown,
      currentGolferId
    );
    expect(result).toBeFalsy();
  });

  it('should check to see if golfer has already been selected for different golfer', () => {
    const currentGolferId = '1234';
    const golferIdDropdown = '1235';

    component.picksFg.setValue({
      golfer1: '1235'
    });

    const result = component.checkGolferSelected(
      golferIdDropdown,
      currentGolferId
    );

    expect(result).toBeTruthy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
