import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { GolfStoreFacade } from '../../store/golf.store.facade';
import { IPlayer, ITournamentResults } from '../../models/models';

@Component({
  selector: 'golf-tournament-leaders',
  templateUrl: './tournament-leaders.component.html',
  styleUrls: ['./tournament-leaders.component.scss']
})
export class TournamentLeadersComponent {
  tournamentData$: Observable<ITournamentResults>;

  constructor(private popup: MatDialog, private golfFacade: GolfStoreFacade) {
    this.tournamentData$ = this.golfFacade.getTournamentData();

    this.popup.afterAllClosed.subscribe(() => {
      this.golfFacade.resetGolferScorecard();
    });
  }

  openPopup(golfer: IPlayer, tournamentActive: boolean): void {
    if (tournamentActive && golfer.isActive) {
      const popupConfig = new MatDialogConfig();
      popupConfig.disableClose = false;
      popupConfig.autoFocus = true;
      this.golfFacade.loadGolferScorecard(golfer.golferId, golfer.round);
      this.popup.open(ScorecardPopComponent, popupConfig);
    }
  }
}
