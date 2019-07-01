import { Component, OnInit, ViewChild } from '@angular/core';
import { SportsApiService } from '../services/sports-api';
import { ITournament } from '../models';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild(LeaderboardComponent, { static: true }) leaderBoard: LeaderboardComponent;
  tournyId: string;
  tournaments: Array<ITournament> = [];

  constructor(private sportsApi: SportsApiService ) {
    this.tournaments = this.sportsApi.getHistoryEvents();
  }

  ngOnInit() {
    this.retrieveHistory();
  }

  retrieveHistory() {
    if (!this.tournyId) {
      this.tournyId = this.tournaments[0].eventId;
    }
    this.sportsApi.setEventId(this.tournyId, true);
  }

  changeTourny() {
    this.retrieveHistory();
    this.leaderBoard.subscription.unsubscribe();
    this.leaderBoard.ngOnInit();
  }
}
