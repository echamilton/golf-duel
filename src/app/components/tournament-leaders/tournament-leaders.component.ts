import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IPlayer } from '../../models/models';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { GolfStoreFacade } from 'src/app/store/golf.store.facade';

@Component({
  selector: 'app-tournament-leaders',
  templateUrl: './tournament-leaders.component.html',
  styleUrls: ['./tournament-leaders.component.scss']
})
export class TournamentLeadersComponent implements OnInit {
  golfers: IPlayer[] = [];
  isTournyActive = false;
  tournyText = '';

  constructor(private popup: MatDialog, private golfFacade: GolfStoreFacade) {}

  ngOnInit(): void {
    this.golfFacade.getTournamentData().subscribe((apiData) => {
      if (apiData) {
        if (apiData.isTournamentActive) {
          this.golfers = apiData.golfers;
          this.isTournyActive = apiData.isTournamentActive;
          this.tournyText = '';
        } else {
          this.tournyText = `The upcoming tournament will commence shortly`;
        }
      }
    });
  }

  get isTournamentActive(): boolean {
    return this.isTournyActive;
  }

  openPopup(golfer: IPlayer): void {
    if (this.isTournamentActive) {
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
