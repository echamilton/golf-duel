import { Component, OnInit } from '@angular/core';
import { SportsApiService } from '../sports-api';
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
      let groups: Array<any>;
      let players: Array<any>;
      groups = golferGroupings;
      players = this.playersList.plrs;

      for (const key in players) {
        let golfer = {} as any;
        const name = players[key].nameF + ' ' + players[key].nameL;

        golfer = groups.find(player => player.name == name);
        if (golfer != null && golfer != undefined) {
          golfer.golferId = players[key].pid;
        }
      }
      this.sportsApi.updateGroups(groups);
      this.loading = false;
      this.subscription.unsubscribe();
    });
  }
}
