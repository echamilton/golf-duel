import { Component, OnInit } from '@angular/core';
import { sportsApiService } from '../sports-api';
import { scrollBar } from '../models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  pgaTournyRespPlayers: any[];
  golfers: Array<scrollBar> = [];
  constructor(private sportsApi: sportsApiService) { }

  ngOnInit() {

    //*Execute API to fetch data and return the player scorecard
    this.sportsApi.getGolfScores().subscribe(apiData => {

      this.pgaTournyRespPlayers = apiData.leaderboard.players;
      for (let key in this.pgaTournyRespPlayers) {
        let golfer = {} as scrollBar;
        golfer.position = this.pgaTournyRespPlayers[key].current_position;
        golfer.name = this.pgaTournyRespPlayers[key].player_bio.first_name + ' ' + this.pgaTournyRespPlayers[key].player_bio.last_name;
        golfer.score = this.pgaTournyRespPlayers[key].total;
        golfer.hole = this.pgaTournyRespPlayers[key].thru;
        if (this.pgaTournyRespPlayers[key].round_state === 'Official') {
          if (golfer.hole.toString() == '18') {
            golfer.hole = 'F';
          } else {
            golfer.hole = 'Thru' + golfer.hole.toString();
          }
        } else {
          golfer.position = '-'
          golfer.hole = '-';
          golfer.score = '-';
        }

        this.golfers.push(golfer);
      }
    }
    )
  }
}
