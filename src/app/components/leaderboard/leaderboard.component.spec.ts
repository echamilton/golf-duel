import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import { GolfStoreFacade } from './../../store/golf.store.facade';
import { LeaderboardComponent } from './leaderboard.component';
import { LoaderComponent } from '../loader/loader.component';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderboardComponent, LoaderComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatProgressSpinnerModule
      ],
      providers: [
        {
          provide: GolfStoreFacade,
          useValue: {
            isDataRefreshed: () => of(),
            getLeaderboardData: () => of()
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should run initit calls when loading component', () => {
    jest.spyOn(component, 'initializeLeaderboard');
    jest.spyOn(component, 'buildGolferLeaderBoard');
    component.ngOnInit();
    expect(component.initializeLeaderboard).toHaveBeenCalled();
    expect(component.buildGolferLeaderBoard).toHaveBeenCalled();
  });

  it('should return columns for getter', () => {
    expect(component.tableColumns[0]).toBe('position');
    expect(component.tableColumns[1]).toBe('team');
    expect(component.tableColumns[2]).toBe('golfersRemain');
    expect(component.tableColumns[3]).toBe('holesRemain');
    expect(component.tableColumns[4]).toBe('score');
  });

  it('should return is tournament active for getter', () => {
    component.isTournyActive = true;
    expect(component.isTournamentActive).toBeTruthy();
  });

  it('should initialize leaderboard models', () => {
    component.initializeLeaderboard();
    expect(component.fantasyLeaders).toEqual([]);
    expect(component.ownPct).toEqual([]);
    expect(component.isLoading).toBeTruthy();
  });

  it('should build the leaderboard', () => {
    component.buildGolferLeaderBoard();
    // jest.spyOn(validationFacade, 'validateOrder').mockReturnValue(of(validationResponseMock));

    expect;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
