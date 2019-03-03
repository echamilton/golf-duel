import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../sports-api';
import { ITournament } from '../models';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

@Component({
  selector: 'app-history',
  providers: [ LeaderboardComponent ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  tournyId: string;
  tournaments: Array<ITournament> = [];

  constructor(private sportsApi: SportsApiService, private leader: LeaderboardComponent ) { 
    this.tournaments = this.sportsApi.getHistoryEvents();
  }

  ngOnInit() {
    this.retrieveHistory();
  }

  retrieveHistory() {
    if(!this.tournyId){
      this.tournyId = this.tournaments[0].eventId;
    }
    this.sportsApi.setEventId(this.tournyId, true);
  }

  changeTourny() {
    this.retrieveHistory();
        this.leader.ngOnInit();
  }
}
