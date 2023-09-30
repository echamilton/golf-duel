import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AuthService } from './services/auth.service';
import { GolfStoreFacade } from './store/golf.store.facade';
import { TournamentLeadersComponent } from './components/tournament-leaders/tournament-leaders.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const authServiceMock = {
    signup: jest.fn(() => Promise.resolve())
  };

  const golfStoreMock = {
    getTournamentData: () => jest.fn(),
    getUserSelectedPicks: () => jest.fn(),
    getLoadingIndicator: () => jest.fn(),
    getAreGroupsLoading: () => jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatDialogModule],
      declarations: [
        AppComponent,
        ToolbarComponent,
        MatMenu,
        TournamentLeadersComponent
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: GolfStoreFacade,
          useValue: golfStoreMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'golf-duel'`, () => {
    expect(component.title).toEqual('443 Fantasy Golf');
    expect(component.version).toEqual('10.0.0');
  });
});
