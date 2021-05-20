import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IPlayer, ITournamentResults } from '../../models/models';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { GolfStoreFacade } from 'src/app/store/golf.store.facade';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-tournament-leaders',
  templateUrl: './tournament-leaders.component.html',
  styleUrls: ['./tournament-leaders.component.scss']
})
export class TournamentLeadersComponent implements OnInit {
  golfers: IPlayer[] = [];
  isTournyActive = false;

  constructor(private popup: MatDialog, private golfFacade: GolfStoreFacade) {}

  ngOnInit(): void {
    this.golfFacade
      .getTournamentData()
      .subscribe((results: ITournamentResults) => {
        const tournamentResults: ITournamentResults = cloneDeep(results);
        if (tournamentResults) {
          this.golfers = tournamentResults.golfers;
          this.isTournyActive = tournamentResults.isTournamentActive;
        }
      });
  }

  openPopup(golfer: IPlayer): void {
    if (this.isTournyActive && golfer.isActive) {
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
