import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SportsApiService } from './../../services/sports-api.service';
import { PickTeamComponent } from './pick-team.component';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './../../services/auth.service';
import { GolfStoreFacade } from './../../store/golf.store.facade';

describe('PickTeamComponent', () => {
  let component: PickTeamComponent;
  let fixture: ComponentFixture<PickTeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PickTeamComponent],
      providers: [
        {
          provide: SportsApiService,
          useValue: {
            isDataRefreshed: () => of(),
            isTournamentActive: () => true
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: () => of()
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => of()
          }
        },
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: () => true
          }
        },
        {
          provide: GolfStoreFacade,
          useValue: {
            getGolferGroups: () => of(),
            getUserSelectedPicks: () => of(),
            getLoadingIndicator: () => of(),
            getAreGroupsLoading: () => of()
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickTeamComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return back value for update operation', () => {
    expect(component.updateOperation).toBe('Update');
  });

  it('should return back value for if user is logged in ', () => {
    expect(component.isLoggedIn).toBeTruthy();
  });

  it('should return back value for delete operation', () => {
    expect(component.deleteOperation).toBe('Delete');
  });

  it('should return back value for if tournament is active', () => {
    expect(component.isTournamentActive).toBeTruthy();
  });
});
