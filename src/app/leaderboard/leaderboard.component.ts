import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { userGolfPicks, leaderResults, indGolferResult } from '../models';
import { leadResultsObj } from './leaderboard-datasource';
import { sportsApiService } from '../sports-api';


@Component({
  selector: 'app-leader',
  styleUrls: ['leaderboard.component.scss'],
  templateUrl: 'leaderboard.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class LeaderboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['position', 'team', 'golfersRemain', 'score'];
  expandedElement: leaderResults | null;
  subscription: Subscription;
  fantasyLeaderObj: leadResultsObj;
  fantasyLeaders: Array<leaderResults> = [];
  pgaTournyRespPlayers: any[];
  picks: Array<indGolferResult> = [];

  constructor(private firebaseDb: AngularFireDatabase, private sportsApi: sportsApiService) {
  }

  ngOnInit() {
    this.subscription = this.firebaseDb.list<userGolfPicks>('myGolfers').valueChanges().subscribe(userGolfPicks => {

      this.fantasyLeaderObj = new leadResultsObj(this.paginator, this.sort);
      this.getGolferLeaderBoard(userGolfPicks);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getGolferLeaderBoard(userGolfPicks) {
    this.sportsApi.getGolfScores().subscribe(apiData => {

      for (let userGolfKey in userGolfPicks) {
        let fantasyLeader = {} as leaderResults;
        let pgaPlayer = {} as any;
        fantasyLeader.team = userGolfPicks[userGolfKey].email;
        fantasyLeader.score = 0;

        this.pgaTournyRespPlayers = apiData.leaderboard.players;
        this.picks = [];

        //Golfer1
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id === userGolfPicks[userGolfKey].golfer1);
        this.setPlayerPicks(pgaPlayer);

        //Golfer2
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id === userGolfPicks[userGolfKey].golfer2);
        this.setPlayerPicks(pgaPlayer);

        //Golfer3
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id === userGolfPicks[userGolfKey].golfer3);
        this.setPlayerPicks(pgaPlayer);

        //Golfer4
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id === userGolfPicks[userGolfKey].golfer4);
        this.setPlayerPicks(pgaPlayer);

        //Golfer5
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id === userGolfPicks[userGolfKey].golfer5);
        this.setPlayerPicks(pgaPlayer);

        //Golfer6
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id === userGolfPicks[userGolfKey].golfer6);
        this.setPlayerPicks(pgaPlayer);

        //Golfer7
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id === userGolfPicks[userGolfKey].golfer7);
        this.setPlayerPicks(pgaPlayer);

        //Golfer8
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id === userGolfPicks[userGolfKey].golfer8);
        this.setPlayerPicks(pgaPlayer);

        /**This is where we will check how many active golfers are left */
        let golferScore: number;
        let i = 0;
        let remain = 0;
        let j = 0;
        this.getSortedData(this.picks);


        for (let pick of this.picks) {
          j++
          if (pick.status === "active") {
            if (i < 5) {
              i++;
              golferScore = pick.score;
              fantasyLeader.score = +fantasyLeader.score + +golferScore;
            }
            remain++;
            fantasyLeader['golfer' + j] = pick.golferName + ' | ' + 'Thru ' + pick.thru + ' | ' + 'Total ' + pick.score;
          } else {
            fantasyLeader['golfer' + j] = pick.golferName + ' | ' + 'CUT' + ' | ' + 'CUT';
          }
        }

        /** if less than 5 golfers then we know that they didnt' make the cut */
        if (remain < 5) {
          fantasyLeader.score = 99;
        }

        fantasyLeader.golfersRemain = remain;
        fantasyLeader.position = '1';
        this.fantasyLeaders.push(fantasyLeader);
      }
      this.fantasyLeaderObj.data = this.fantasyLeaders;
      this.getSortedData(this.fantasyLeaderObj.data);
    })
  }

  setPlayerPicks(pgaPlayer) {
    let pick = {} as indGolferResult;
    if (pgaPlayer != undefined) {
      pick.golferId = pgaPlayer.player_id;
      pick.status = pgaPlayer.status;
      pick.golferName = pgaPlayer.player_bio.first_name + ' ' + pgaPlayer.player_bio.last_name;
      pick.score = pgaPlayer.total;
      pick.thru = pgaPlayer.thru;
      this.picks.push(pick);
    }
  }

  getSortedData(data) {
    this.sort.active = 'score';
    this.sort.direction = 'asc';

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'golferId': return compare(a.name, b.name, isAsc);
        case 'score': return compare(+a.score, +b.score, isAsc);
        default: return 0;
      }
      function compare(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
      }
    });
  }
}
