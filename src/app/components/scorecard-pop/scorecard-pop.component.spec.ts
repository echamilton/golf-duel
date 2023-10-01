import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScorecardPopComponent } from './scorecard-pop.component';
import { SportsApiService } from './../../services/sports-api.service';

describe('ScorecardPopComponent', () => {
  let component: ScorecardPopComponent;
  let fixture: ComponentFixture<ScorecardPopComponent>;

  const mockService = {
    getGolferScoreCard: () => jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ScorecardPopComponent],
      providers: [
        {
          provide: SportsApiService,
          useValue: mockService
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorecardPopComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return color based on value', () => {
    const color1 = component.getColor('Par');
    const color2 = component.getColor('Bogey');
    const color3 = component.getColor('Eagle');
    const color4 = component.getColor('NOSCORE');
    const color5 = component.getColor('Birdie');

    expect(color1).toBe('black');
    expect(color2).toBe('red');
    expect(color3).toBe('green');
    expect(color4).toBe('black');
    expect(color5).toBe('blue');
  });

  it('should return default value of purple', () => {
    const color1 = component.getColor('Triple Bogey');
    expect(color1).toBe('purple');
  });
});
