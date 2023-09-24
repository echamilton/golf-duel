import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { GolfStoreFacade } from '../../store/golf.store.facade';
import { IPlayer, ITournamentResults } from '../../models/models';

@Component({
  selector: 'app-tournament-leaders',
  templateUrl: './tournament-leaders.component.html',
  styleUrls: ['./tournament-leaders.component.scss']
})
export class TournamentLeadersComponent {
  tournamentData$: Observable<ITournamentResults>;

  constructor(private popup: MatDialog, private golfFacade: GolfStoreFacade) {
    this.tournamentData$ = this.golfFacade.getTournamentData();
  }

  openPopup(golfer: IPlayer, tournamentActive: boolean): void {
    if (tournamentActive && golfer.isActive) {
      const popupConfig = new MatDialogConfig();
      popupConfig.disableClose = false;
      popupConfig.autoFocus = true;
      popupConfig.data = {
        golferId: golfer.golferId,
        round: golfer.round,
        img: golfer.imageLink
      };

      this.popup.open(ScorecardPopComponent, popupConfig);
    }
  }
}
