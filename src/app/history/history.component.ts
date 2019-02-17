import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../sports-api';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private sportsApi: SportsApiService) { }

  ngOnInit() {
    this.retrieveHistory();
  }

  retrieveHistory() {
    console.log(this.sportsApi.getHistoryEvents());
  }

}
