import { Component, OnInit, ViewChild } from '@angular/core';
import { SportsApiService } from '../sports-api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { _tourny } from '../constants';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScrollBar, Tournament } from '../models';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
// export class ToolbarComponent implements OnInit {
  export class ToolbarComponent{
  @ViewChild('sidenav') sidenav: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );

  pgaTournyRespPlayers: any[];
  golfers: Array<ScrollBar> = [];
  enablePicks: boolean;
  tournaments: Array<Tournament> = [];
  constructor(private sportsApi: SportsApiService, private router: Router,
    private breakpointObserver: BreakpointObserver ) { }

  ngOnInit() {
    // this.sidenavService = this.sidenav;
    this.tournaments = _tourny;
    this.golfers = [];

    // Execute API to fetch data and return the player scorecard
    this.enablePicks = true;
    this.sportsApi.getGolfScores().subscribe(apiData => {

      this.pgaTournyRespPlayers = apiData.leaderboard.players;
      this.sportsApi.setApiData(apiData);
      for (let key in this.pgaTournyRespPlayers) {
        let golfer = {} as ScrollBar;
        golfer.position = this.pgaTournyRespPlayers[key].current_position;
        golfer.name = this.pgaTournyRespPlayers[key].player_bio.first_name + ' ' + this.pgaTournyRespPlayers[key].player_bio.last_name;
        golfer.score = this.pgaTournyRespPlayers[key].total;
        golfer.hole = this.pgaTournyRespPlayers[key].thru;
        if (apiData.leaderboard.round_state === 'Official' || apiData.leaderboard.round_state === 'In Progress') {
          this.enablePicks = false;
          if (golfer.hole == '18') {
            golfer.hole = 'F';
          } else {
            if (golfer.hole == null) {
              golfer.hole = 'Thru 0';
            } else {
              golfer.hole = 'Thru' + ' ' + golfer.hole;
            }
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

  onTournySelect(eventId) {
    this.sportsApi.setEventId(eventId);
    this.ngOnInit();
    this.router.navigate(['/leader']);
  }
}
