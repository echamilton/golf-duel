import { Component, OnInit, ViewChild } from '@angular/core';
import { SportsApiService } from '../sports-api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../authservice';
import { IScrollBar } from '../models';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})

export class ToolbarComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  pgaTournyRespPlayers: any[];
  golfers: Array<IScrollBar> = [];

  constructor(private sportsApi: SportsApiService, private router: Router,
    private breakpointObserver: BreakpointObserver, private authService: AuthService) { }

  ngOnInit() {
    this.golfers = [];

    // Execute API to fetch data and return the player scorecard
    this.sportsApi.getGolfScores().subscribe(apiData => {

      this.pgaTournyRespPlayers = apiData.leaderboard.players;
      this.sportsApi.setApiData(apiData);

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
        if (this.sportsApi.isTournamentActive(apiData.leaderboard.round_state) == true) {
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

        } else {
          golfer.position = '-';
          golfer.hole = '-';
          golfer.score = '-';
        }
        this.golfers.push(golfer);
      }
    }
    );
  }

  isLoggedIn() {
    let email = this.authService.getCurrentUser();
    if (email != null || email != undefined) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/leader']);
  }
}
