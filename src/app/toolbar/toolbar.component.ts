import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../sports-api';
import { Router } from '@angular/router';
import { AuthService } from '../authservice';
import { IScrollBar } from '../models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {
  pgaTournyRespPlayers: any[];
  golfers: Array<IScrollBar> = [];
  error: boolean;
  tournyText: string;

  constructor(private sportsApi: SportsApiService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.golfers = [];
    this.error = false;
    this.tournyText = '';

    this.sportsApi.getGolfScores().subscribe(
      apiData => this.buildLeaderboard(apiData),
      err => this.handleError(err),
    )
  }

  buildLeaderboard(pgaScores) {
    this.pgaTournyRespPlayers = pgaScores.leaderboard.players;
    this.sportsApi.setApiData(pgaScores);

    for (let key in this.pgaTournyRespPlayers) {
      let golfer = {} as IScrollBar;

      if (this.sportsApi.isGolferActive(this.pgaTournyRespPlayers[key].status) == false) {
        continue;
      }

      golfer.position = this.pgaTournyRespPlayers[key].current_position;
      golfer.golferId = this.pgaTournyRespPlayers[key].player_id;
      golfer.name = this.pgaTournyRespPlayers[key].player_bio.first_name + ' ' + this.pgaTournyRespPlayers[key].player_bio.last_name;
      golfer.score = this.pgaTournyRespPlayers[key].total;
      golfer.hole = this.pgaTournyRespPlayers[key].thru;
      golfer.scoreToday = this.pgaTournyRespPlayers[key].today;
      if (this.sportsApi.isTournamentActive(pgaScores.leaderboard.round_state) == true) {
        if (golfer.hole == '18') {
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

  handleError(err) {
    this.error = true;
    this.tournyText = this.sportsApi.getEventName() + ' will commence shortly';
  }

  isLoggedIn() {
    let email = this.authService.getCurrentUser();
    if (email != null && email !== undefined && email != '') {
      return true;
    } else {
      return false;
    }
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
