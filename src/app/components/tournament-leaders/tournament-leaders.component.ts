import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IPlayer, ITournamentResults } from '../../models/models';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { GolfStoreFacade } from '../../store/golf.store.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tournament-leaders',
  templateUrl: './tournament-leaders.component.html',
  styleUrls: ['./tournament-leaders.component.scss']
})
export class TournamentLeadersComponent implements OnInit {
  tournamentData$: Observable<ITournamentResults>;

  constructor(private popup: MatDialog, private golfFacade: GolfStoreFacade) {
    this.tournamentData$ = this.golfFacade.getTournamentData();
  }

  ngOnInit(): void {}

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
      const dialogRef = this.popup.open(ScorecardPopComponent, popupConfig);
      dialogRef.afterClosed().subscribe();
    }
  }
}
