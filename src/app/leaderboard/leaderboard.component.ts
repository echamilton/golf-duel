import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { userGolfPicks, golferDetail, golferItem, leaderResults, indGolferResult } from '../models';
import { leadResultsObj } from './leaderboard-datasource';
import { sportsApiService } from '../sports-api';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';

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
  answer: string;
  fantasyLeaders: Array<leaderResults> = [];
  golferItems: Array<golferItem> = [];
  pgaTournyRespPlayers: any[];
  ownPct: Array<golferDetail> = [];
  picks: Array<indGolferResult> = [];
  eventId: string;
  entries: number;

  constructor(private popup: MatDialog, private router: Router, private firebaseDb: AngularFireDatabase, private sportsApi: sportsApiService) {
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
      this.entries = userGolfPicks.length;

      for (let userGolfKey in userGolfPicks) {
        if (userGolfPicks[userGolfKey].eventId != this.sportsApi.getEventId()) {
          continue;
        }
        let fantasyLeader = {} as leaderResults;
        let pgaPlayer = {} as any;
        if (userGolfPicks[userGolfKey].email === undefined) {
          fantasyLeader.team = userGolfPicks[userGolfKey].team;
        } else {
          fantasyLeader.team = userGolfPicks[userGolfKey].email;
        }
        fantasyLeader.score = 0;

        this.pgaTournyRespPlayers = apiData.leaderboard.players;
        this.picks = [];

        //Golfer1
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer1);
        this.setPlayerPicks(pgaPlayer);

        //Golfer2
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer2);
        this.setPlayerPicks(pgaPlayer);

        //Golfer3
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer3);
        this.setPlayerPicks(pgaPlayer);

        //Golfer4
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer4);
        this.setPlayerPicks(pgaPlayer);

        //Golfer5
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer5);
        this.setPlayerPicks(pgaPlayer);

        //Golfer6
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer6);
        this.setPlayerPicks(pgaPlayer);

        //Golfer7
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer7);
        this.setPlayerPicks(pgaPlayer);

        //Golfer8
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer8);
        this.setPlayerPicks(pgaPlayer);

        /**This is where we will check how many active golfers are left */
        let golferScore: number;
        let i = 0;
        let remain = 0;
        let j = 0;
        this.getSortedData(this.picks);

        if (apiData.leaderboard.round_state === 'Official') {
          this.golferItems = [];
          for (let pick of this.picks) {
            let golferItem = {} as golferItem;
            j++
            fantasyLeader['id' + j] = pick.golferId;
            golferItem.id = pick.golferId;
            golferItem.name = pick.golferName;
            golferItem.round = pick.round;
            if (pick.status === "active") {
              if (i < 5) {
                i++;
                golferScore = pick.score;
                fantasyLeader.score = +fantasyLeader.score + +golferScore;
              }
              remain++;
              if(pick.thru == 18 ){ golferItem.thru = 'F' }else{
              golferItem.thru = 'Thru' + ' ' + pick.thru;}
              golferItem.score = pick.score;
              golferItem.color = 'primary';
              golferItem.ownPct = 50;
            } else {
              golferItem.score = 99;
              golferItem.thru = 'CUT';
              golferItem.color = 'warn';
            }
            this.golferItems.push(golferItem);
          }
        } else {
          /**Default to 8 active golfers and 99 score when golf tourny not active */
          remain = 8;
          fantasyLeader.score = 99.
        }

        fantasyLeader.golfers = this.golferItems;

        /** if less than 5 golfers then we know that they didnt' make the cut */
        if (remain < 5) {
          fantasyLeader.score = 99;
        }

        fantasyLeader.golfersRemain = remain;
        this.fantasyLeaders.push(fantasyLeader);
      }
      this.getSortedData(this.fantasyLeaders);
      this.fantasyLeaderObj.data = this.fantasyLeaders;
      this.rankEntries();
    })
  }

  setPlayerPicks(pgaPlayer) {
    let pick = {} as indGolferResult;
    if (pgaPlayer != undefined) {
      pick.golferId = pgaPlayer.player_id;
      pick.status = pgaPlayer.status;
      pick.golferName = pgaPlayer.player_bio.first_name + ' ' + pgaPlayer.player_bio.last_name;
      pick.thru = pgaPlayer.thru;
      pick.round = pgaPlayer.current_round;
      if (pick.status === 'active') {
        pick.score = pgaPlayer.total;
      } else {
        pick.score = 99;
      }
      this.picks.push(pick);

      /** Check if entry exists for golfer, if not create and add 1, otherwise
       * increment the counter...       */

      let ownPct = this.ownPct.find(x => x.golferId === pick.golferId);
      if (ownPct != undefined) {
        ownPct.count++;
        ownPct.pct = ownPct.count / this.entries * 100;
      } else {
        let ownPct = {} as golferDetail;
        ownPct.golferId = pick.golferId;
        ownPct.count = 1;
        ownPct.pct = ownPct.count / this.entries * 100;
        this.ownPct.push(ownPct);
      }
    }
  }

  rankEntries() {
    let position = 0;
    let dupPos = 0;
    let prevScore = 999;
    for (let key in this.fantasyLeaders) {
      if (this.fantasyLeaders[key].score == prevScore) {
        this.fantasyLeaders[key].position = position;
        dupPos++;
      } else {
        position++;
        position = position + dupPos;
        dupPos = 0;
        this.fantasyLeaders[key].position = position;
      }
      prevScore = this.fantasyLeaders[key].score;


      /** This will iterate through the golfers and map the value of  */
      for (let golferKey in this.fantasyLeaders[key].golfers){
        for(let ownKey in this.ownPct){
          if(this.ownPct[ownKey].golferId == this.fantasyLeaders[key].golfers[golferKey].id){
            this.fantasyLeaders[key].golfers[golferKey].ownPct = this.ownPct[ownKey].pct;
            this.fantasyLeaders[key].golfers[golferKey].ownPct.toFixed[0];

          }
        }
      }
    }
  }

  scorecard(golferId) {
    this.router.navigate(['/scorecard', golferId]);
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

  openPopup(golferId) {

    const popupConfig = new MatDialogConfig();

    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { golfer: golferId };

    const dialogRef = this.popup.open(ScorecardPopComponent, popupConfig);

    dialogRef.afterClosed().subscribe(
    );
  }

}
