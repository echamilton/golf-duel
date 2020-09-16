import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../../services/sports-api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IPlayer } from '../../models/models';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';

@Component({
  selector: 'app-tournament-leaders',
  templateUrl: './tournament-leaders.component.html',
  styleUrls: ['./tournament-leaders.component.scss']
})
export class TournamentLeadersComponent implements OnInit {
  golfers: IPlayer[] = [];
  error: boolean;
  tournyText = '';

  constructor(private sportsApi: SportsApiService, private popup: MatDialog) {}

  ngOnInit(): void {
    this.sportsApi.getGolfScores().subscribe(
      (apiData) => (this.golfers = apiData.golfers),
      (err) => this.handleError()
    );
  }

  get isTournamentActive(): boolean {
    return this.sportsApi.isTournamentActive();
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

  handleError(): void {
    this.error = true;
    this.tournyText = `${this.sportsApi.getEventName()} will commence shortly`;
  }
}
