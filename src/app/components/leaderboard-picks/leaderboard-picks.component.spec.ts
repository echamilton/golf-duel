import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { LeaderboardPicksComponent } from './leaderboard-picks.component';
import { GOLFER_ACTIVE, GOLFER_INACTIVE } from './../../utilities/test-data';

describe('LeaderboardComponent', () => {
  let component: LeaderboardPicksComponent;
  let fixture: ComponentFixture<LeaderboardPicksComponent>;
  const openSnackBar = jest.spyOn(
    LeaderboardPicksComponent.prototype as any,
    'openSnackBar'
  );

  const setPopUpConfigMock = jest.spyOn(
    LeaderboardPicksComponent.prototype as any,
    'setPopupConfig'
  );

  const snackBarMock = {
    open: jest.fn()
  };

  const dialogMock = {
    open: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderboardPicksComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: snackBarMock
        },
        {
          provide: MatDialog,
          useValue: dialogMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardPicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should return value CUT for getter', () => {
    expect(component.golferCutStatus).toBe('CUT');
  });

  it('should return value ACTIVE for getter', () => {
    expect(component.golferActiveStatus).toBe('ACTIVE');
  });

  it('should return value WD for getter', () => {
    expect(component.golferWithdrawnStatus).toBe('WD');
  });

  it('should show user snackbar if golfer is not active on click of popup', () => {
    const golferNotActive = GOLFER_INACTIVE;
    component.openPopup(golferNotActive);
    expect(openSnackBar).toHaveBeenCalled();
  });

  it('should open golf scorecard if golfer is active on click of popup', () => {
    const golferActive = GOLFER_ACTIVE;

    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = {
      golferId: golferActive.golferId,
      round: golferActive.round,
      img: golferActive.imageLink
    };
    component.openPopup(golferActive);
    expect(setPopUpConfigMock).toHaveBeenCalled();
    expect(dialogMock.open).toBeCalledWith(ScorecardPopComponent, popupConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
