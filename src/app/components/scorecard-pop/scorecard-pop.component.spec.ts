import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ScorecardPopComponent } from './scorecard-pop.component';
import { SportsApiService } from './../../services/sports-api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';

xdescribe('ScorecardPopComponent', () => {
  let component: ScorecardPopComponent;
  let fixture: ComponentFixture<ScorecardPopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ScorecardPopComponent, MAT_DIALOG_DATA],
      providers: [
        {
          provide: SportsApiService,
          useValue: {
            getGolferScoreCard: () => of()
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorecardPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
