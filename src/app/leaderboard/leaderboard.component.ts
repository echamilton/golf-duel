import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUserGolfPicks, IGolferDetail, IGolferItem, ILeaderResults, IIndGolferResult } from '../models';
import { SportsApiService } from '../sports-api';
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
  displayedColumns = ['position', 'team', 'golfersRemain', 'holesRemain', 'score'];
  expandedElement: ILeaderResults | null;
  subscription: Subscription;
  answer: string;
  dataSource: any[];
  fantasyLeaders: Array<ILeaderResults> = [];
  golferItems: Array<IGolferItem> = [];
  pgaTournyRespPlayers: any[];
  ownPct: Array<IGolferDetail> = [];
  picks: Array<IIndGolferResult> = [];
  eventId: string;
  status: string;
  entries: number;

  constructor(private popup: MatDialog, private router: Router,
    private firebaseDb: AngularFireDatabase,
    private sportsApi: SportsApiService) {
  }

  ngOnInit() {
    this.subscription = this.firebaseDb.list<IUserGolfPicks>('myGolfers').valueChanges().subscribe(userGolfPicks => {

      this.getGolferLeaderBoard(userGolfPicks);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getGolferLeaderBoard(userGolfPicks) {
    this.sportsApi.getGolfScores().subscribe(apiData => {
      this.sportsApi.setApiData(apiData);
      this.entries = 0;
      this.status = apiData.leaderboard.round_state;


      for (let userGolfKey in userGolfPicks) {
        if (userGolfPicks[userGolfKey].eventId !== this.sportsApi.getEventId()) {
          continue;
        }
        this.entries++;
        let fantasyLeader = {} as ILeaderResults;
        let pgaPlayer = {} as any;
        fantasyLeader.team = userGolfPicks[userGolfKey].team;

        fantasyLeader.score = 0;
        /**4 rounds, 5 golfers, 18 holes */
        if (apiData.leaderboard.current_round === 4) {
          fantasyLeader.holesRemain = 1 * 5 * 18;
        } else if (apiData.leaderboard.current_round === 3) {
          fantasyLeader.holesRemain = 2 * 5 * 18;
        } else if (apiData.leaderboard.current_round === 2) {
          fantasyLeader.holesRemain = 3 * 5 * 18;
        } else {
          fantasyLeader.holesRemain = 4 * 5 * 18;
        }


        this.pgaTournyRespPlayers = apiData.leaderboard.players;
        this.picks = [];

        // Golfer1
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer1);
        this.setPlayerPicks(pgaPlayer);

        // Golfer2
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer2);
        this.setPlayerPicks(pgaPlayer);

        // Golfer3
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer3);
        this.setPlayerPicks(pgaPlayer);

        // Golfer4
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer4);
        this.setPlayerPicks(pgaPlayer);

        // Golfer5
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer5);
        this.setPlayerPicks(pgaPlayer);

        // Golfer6
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer6);
        this.setPlayerPicks(pgaPlayer);

        // Golfer7
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer7);
        this.setPlayerPicks(pgaPlayer);

        // Golfer8
        pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == userGolfPicks[userGolfKey].golfer8);
        this.setPlayerPicks(pgaPlayer);

        /**This is where we will check how many active golfers are left */
        let golferScore: number;
        let i = 0;
        let remain = 0;
        let j = 0;
        this.getSortedData(this.picks);

        if (this.isTournyActive() == true) {
          this.golferItems = [];
          for (let pick of this.picks) {
            let golferItem = {} as IGolferItem;
            j++;
            fantasyLeader['id' + j] = pick.golferId;
            golferItem.id = pick.golferId;
            golferItem.name = pick.golferName;
            golferItem.round = pick.round;
            golferItem.status = pick.status;
            if (pick.status === 'active') {
              if (i < 5) {
                i++;
                golferScore = pick.score;
                fantasyLeader.score = +fantasyLeader.score + +golferScore;
                fantasyLeader.holesRemain = fantasyLeader.holesRemain - pick.thru;
              }
              remain++;
              if (pick.thru == 18) { golferItem.thru = 'F'; } else {
                if (pick.thru !== null) {
                  golferItem.thru = 'Thru' + ' ' + pick.thru;
                } else {
                  golferItem.thru = 'Thru 0';
                }
              }
              golferItem.score = pick.score;
              golferItem.color = 'primary';
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
          fantasyLeader.score = 99;
        }

        fantasyLeader.golfers = this.golferItems;

        /** if less than 5 golfers then we know that they didnt' make the cut */
        if (remain < 5) {
          fantasyLeader.score = 99;
          fantasyLeader.holesRemain = 0;
        }

        fantasyLeader.golfersRemain = remain;
        this.fantasyLeaders.push(fantasyLeader);
      }
      this.getSortedData(this.fantasyLeaders);
      this.dataSource = this.fantasyLeaders;
      this.rankEntries();
    });
  }

  setPlayerPicks(pgaPlayer) {
    let pick = {} as IIndGolferResult;
    if (pgaPlayer != undefined) {
      pick.golferId = pgaPlayer.player_id;
      pick.status = pgaPlayer.status;
      pick.golferName = pgaPlayer.player_bio.first_name + ' ' + pgaPlayer.player_bio.last_name;
      pick.thru = pgaPlayer.thru;
      pick.round = pgaPlayer.current_round;
      pick.status = pgaPlayer.status;
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
      } else {
        let ownPct = {} as IGolferDetail;
        ownPct.golferId = pick.golferId;
        ownPct.count = 1;
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
      for (let golferKey in this.fantasyLeaders[key].golfers) {
        for (let ownKey in this.ownPct) {
          if (this.ownPct[ownKey].golferId == this.fantasyLeaders[key].golfers[golferKey].id) {
            this.fantasyLeaders[key].golfers[golferKey].ownPct = this.ownPct[ownKey].count / this.entries * 100;
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

  isTournyActive() {
    if (this.status === 'Official' || this.status === 'In Progress') {
      return true;
    } else {
      return false;
    }
  }

  isCut(status: string) {
    if (status == 'cut') {
      return true;
    } else {
      return false;
    }
  }
}
