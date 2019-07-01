import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../services/sports-api';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from '../services/authservice';
import { IScrollBar } from '../models';
import { AdminEmail } from '../constants';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {
  pgaTournyRespPlayers: any[];
  golfers: Array<IScrollBar> = [];
  error: boolean;
  currentRound: string;
  tournyText: string;

  constructor(private sportsApi: SportsApiService, private router: Router, private authService: AuthService,
    private popup: MatDialog) { }

  ngOnInit() {
    this.golfers = [];
    this.error = false;
    this.tournyText = '';
    this.sportsApi.getGolfScores().subscribe(
      apiData => this.buildLeaderboard(apiData),
      err => this.handleError(),
    );
  }

  buildLeaderboard(pgaScores) {
    this.pgaTournyRespPlayers = pgaScores.rows;
    this.currentRound = pgaScores.tournamentRoundId;
    this.sportsApi.setApiData(pgaScores);
    const activeTourny = this.sportsApi.isTournamentActive(pgaScores.roundState);

    for (const player of this.pgaTournyRespPlayers) {
      if (this.sportsApi.isGolferActive(!player.status)) {
        continue;
      }
      const golfer = this.buildGolferItem(player, activeTourny);
      this.golfers.push(golfer);
    }
  }

  buildGolferItem(player: any, activeTourny: boolean): IScrollBar {
    const golfer = {} as IScrollBar;
    golfer.position = player.positionCurrent;
    golfer.golferId = player.playerId;
    golfer.name = player.playerNames.firstName + ' ' + player.playerNames.lastName;
    golfer.score = player.total;
    golfer.hole = player.thru;
    golfer.scoreToday = player.today;
    if (activeTourny) {
      if (golfer.hole === '18' || golfer.hole === 'F*' || golfer.hole === 'F') {
        golfer.hole = 'F';
      } else {
        if (golfer.hole == null) {
          golfer.hole = 'Thru 0';
        } else {
          golfer.hole = 'Thru' + ' ' + golfer.hole;
        }
      }

      if (golfer.score === '0') {
        golfer.score = 'E';
      }
      if (golfer.scoreToday === '0') {
        golfer.scoreToday = 'E';
      }

    } else {
      golfer.position = '-';
      golfer.hole = '-';
      golfer.score = '-';
    }
    return golfer;
  }

  handleError() {
    this.error = true;
    this.tournyText = this.sportsApi.getEventName() + ' will commence shortly';
  }

  isLoggedIn() {
    return (this.authService.getCurrentUser()) ? true : false;
  }

  isAdmin() {
    return this.authService.getCurrentUser() === AdminEmail ? true : false;
  }

  openPopup(golferId: string, golferName: string) {
    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { golfer: golferId, roundId: this.currentRound, name: golferName };

    const dialogRef = this.popup.open(ScorecardPopComponent, popupConfig);

    dialogRef.afterClosed().subscribe();
  }

  navigate() {
    this.sportsApi.setEventId(undefined, false);
    this.router.navigate(['/leader']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/leader']);
  }
}
