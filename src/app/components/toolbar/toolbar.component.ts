import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GolfStoreFacade } from './../../store/golf.store.facade';
import { AuthService } from '../../services/auth.service';
import { isInvalidGolfer } from 'src/app/utilities/player-team-validator';
import { Observable } from 'rxjs';
import { ITournamentResults, IUserGolfPicks } from 'src/app/models/models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  isInvalidLineup: boolean = false;
  userSelections$!: Observable<IUserGolfPicks>;
  tournamentResults$!: Observable<ITournamentResults>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private golfFacade: GolfStoreFacade
  ) {}

  ngOnInit(): void {
    this.checkForInvalidGolfers();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get invalidPlayerText(): string {
    return 'You have an invalid lineup';
  }

  reloadLeaderboard(): void {
    this.golfFacade.loadTournamentData();
    this.golfFacade.triggerRefreshData();
    this.router.navigate(['/leader']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/leader']);
  }

  checkForInvalidGolfers(): void {
    this.golfFacade
      .getToolbarValidationData()
      .subscribe(([tournamentResults, userSelections]) => {
        if (userSelections != undefined && tournamentResults != undefined) {
          this.isInvalidLineup = isInvalidGolfer(
            userSelections,
            tournamentResults.golfers
          );
        }
      });
  }
}
