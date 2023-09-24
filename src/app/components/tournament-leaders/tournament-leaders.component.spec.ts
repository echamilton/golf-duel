import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TournamentLeadersComponent } from './tournament-leaders.component';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { GolfStoreFacade } from './../../store/golf.store.facade';
import { GOLFER_ACTIVE, GOLFER_INACTIVE } from './../../utilities/test-data';

describe('TournamentLeadersComponent', () => {
  let component: TournamentLeadersComponent;
  let fixture: ComponentFixture<TournamentLeadersComponent>;

  const dialogMock = {
    open: jest.fn()
  };

  const facadeMock = {
    getTournamentData: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentLeadersComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogMock
        },
        {
          provide: GolfStoreFacade,
          useValue: facadeMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentLeadersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should launch popup to open when click golfer if golfer is active', () => {
    const golferMockActive = GOLFER_ACTIVE;
    const tournamentActive = true;

    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = {
      golferId: golferMockActive.golferId,
      round: golferMockActive.round,
      img: golferMockActive.imageLink
    };

    component.openPopup(golferMockActive, tournamentActive);
    expect(dialogMock.open).toBeCalledWith(ScorecardPopComponent, popupConfig);
  });

  it('should not launch popup to open when click golfer if golfer is not active', () => {
    const golferMock = GOLFER_INACTIVE;
    const tournamentActive = false;
    component.openPopup(golferMock, tournamentActive);
    expect(dialogMock.open).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
