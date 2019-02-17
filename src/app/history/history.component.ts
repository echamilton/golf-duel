import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../sports-api';
import { ITournament } from '../models';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  tournyId: string;
  tournaments: Array<ITournament> = [];

  constructor(private sportsApi: SportsApiService ) { }

  ngOnInit() {
    this.retrieveHistory();
  }

  retrieveHistory() {
    this.tournaments = this.sportsApi.getHistoryEvents();
  }

  changeTourny(){
    this.sportsApi.setEventId(this.tournyId);
  }

}
