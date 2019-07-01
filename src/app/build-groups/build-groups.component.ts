import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../services/sports-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-build-groups',
  templateUrl: './build-groups.component.html',
  styleUrls: ['./build-groups.component.scss']
})
export class BuildGroupsComponent implements OnInit {
  playersList: any;
  loading: boolean;
  subscription: Subscription;

  constructor(private sportsApi: SportsApiService) { }

  ngOnInit() {
    this.loading = true;
    this.sportsApi.getGolfersPgaTour().subscribe(apiData => {
      this.playersList = apiData;
      this.loading = false;
    }
    );
  }

  updateGroups() {
    this.loading = true;
    this.updateList();
  }

  updateList() {
    this.subscription = this.sportsApi.getGolferGroupings().subscribe(golferGroupings => {
      for (const plyr of this.playersList.plrs) {
        const name = plyr.nameF + ' ' + plyr.nameL;
        const golfer = golferGroupings.find(player => player.name == name);
        if (golfer) {
          golfer.golferId = plyr.pid;
        }
      }
      this.sportsApi.updateGroups(golferGroupings);
      this.loading = false;
      this.subscription.unsubscribe();
    });
  }
}
