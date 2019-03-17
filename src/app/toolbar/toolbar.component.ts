import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../sports-api';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthService } from '../authservice';
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
  admin: boolean;
  currentRound: string;
  tournyText: string;

  constructor(private sportsApi: SportsApiService, private router: Router, private authService: AuthService,
    private popup: MatDialog) { }

  ngOnInit() {
    this.golfers = [];
    this.error = false;
    this.tournyText = '';
    this.isAdmin();

    this.sportsApi.getGolfScores().subscribe(
      apiData => this.buildLeaderboard(apiData),
      err => this.handleError(),
    );
  }

  buildLeaderboard(pgaScores) {
    this.pgaTournyRespPlayers = pgaScores.rows;
    this.currentRound = pgaScores.tournamentRoundId;
    this.sportsApi.setApiData(pgaScores);

    for (let key in this.pgaTournyRespPlayers) {
      let golfer = {} as IScrollBar;

      if (this.sportsApi.isGolferActive(this.pgaTournyRespPlayers[key].status) == false) {
        continue;
      }

      golfer.position = this.pgaTournyRespPlayers[key].positionCurrent;
      golfer.golferId = this.pgaTournyRespPlayers[key].playerId;
      golfer.name = this.pgaTournyRespPlayers[key].playerNames.firstName + ' ' + this.pgaTournyRespPlayers[key].playerNames.lastName;
      golfer.score = this.pgaTournyRespPlayers[key].total;
      golfer.hole = this.pgaTournyRespPlayers[key].thru;
      golfer.scoreToday = this.pgaTournyRespPlayers[key].today;
      if (this.sportsApi.isTournamentActive(pgaScores.roundState) == true) {
        if (golfer.hole == '18' || golfer.hole == 'F*' || golfer.hole == 'F') {
          golfer.hole = 'F';
        } else {
          if (golfer.hole == null) {
            golfer.hole = 'Thru 0';
          } else {
            golfer.hole = 'Thru' + ' ' + golfer.hole;
          }
        }

        if (golfer.score == '0') {
          golfer.score = 'E';
        }
        if (golfer.scoreToday == '0') {
          golfer.scoreToday = 'E';
        }

      } else {
        golfer.position = '-';
        golfer.hole = '-';
        golfer.score = '-';
      }
      this.golfers.push(golfer);
    }

  }

  handleError() {
    this.error = true;
    this.tournyText = this.sportsApi.getEventName() + ' will commence shortly';
  }

  isLoggedIn() {
    const email = this.authService.getCurrentUser();
    if (email !== null && email !== undefined && email !== '') {
      return true;
    } else {
      return false;
    }
  }

  isAdmin() {
    this.admin = this.authService.getCurrentUser() === AdminEmail ? true : false;
  }

  openPopup(golferId: string, golferName: string ) {
    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { golfer: golferId,roundId: this.currentRound, name: golferName };

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
