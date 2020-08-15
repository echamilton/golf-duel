import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { IGolferDetail, IPlayer, ILeaderResults, IIndGolferResult } from '../../models/models';
import { SportsApiService } from '../../services/sports-api';
import { Messages, LeaderColumns } from './../../models/constants';
import { Subscription } from 'rxjs';
import { ScorecardPopComponent } from '../scorecard-pop/scorecard-pop.component';
import { sortScores } from './../../utilities/sorter';

@Component({
  selector: 'app-leader',
  styleUrls: ['leaderboard.component.scss'],
  templateUrl: 'leaderboard.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class LeaderboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = LeaderColumns;
  expandedElement: ILeaderResults | null;
  dataSource: any[];
  subscription: Subscription;
  currentRound: string;
  fantasyLeaders: Array<ILeaderResults> = [];
  golferItems: Array<IPlayer> = [];
  pgaTournyRespPlayers: any[];
  ownPct: Array<IGolferDetail> = [];
  picks: Array<IIndGolferResult> = [];
  status: string;
  entries: number;
  config = new MatSnackBarConfig();

  constructor(private popup: MatDialog, private sportsApi: SportsApiService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.subscription = this.sportsApi.getGolferPicks().subscribe(userGolfPicks => {
      this.getGolferLeaderBoard(userGolfPicks);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getGolferLeaderBoard(userGolfPicks) {
    this.sportsApi.getGolfScores()
      .subscribe(
        apiData => { this.buildResults(userGolfPicks, apiData); },
        err => { this.default(err, userGolfPicks); });
  }

  setPlayerPicks(pgaPlayer) {
    const pick = {} as IIndGolferResult;
    let thruString: string;
    if (pgaPlayer) {
      pick.golferId = pgaPlayer.golferId;
      pick.status = pgaPlayer.status;
      pick.golferName = pgaPlayer.name;
      pick.imageLink = pgaPlayer.imageLink;
      thruString = pgaPlayer.thru;

      if (thruString === '--' || thruString === '') {
        pick.thru = 0;
      } else if (thruString === 'F' || thruString === 'F*') {
        pick.thru = 18;
      } else {
        pick.thru = Number(thruString);
      }
      pick.round = pgaPlayer.tournamentRoundId;
      pick.status = pgaPlayer.status;
      if (this.sportsApi.isGolferActive(pick.status)) {
        pick.score = pgaPlayer.score;
      } else {
        pick.score = 99;
      }
      this.picks.push(pick);

      /** Check if entry exists for golfer, if not create and add 1, otherwise
       * increment the counter...       */
      const ownPct = this.ownPct.find(x => x.golferId === pick.golferId);
      if (ownPct) {
        ownPct.count++;
      } else {
        const ownPctNew = {} as IGolferDetail;
        ownPctNew.golferId = pick.golferId;
        ownPctNew.count = 1;
        this.ownPct.push(ownPctNew);
      }
    }
  }

  buildResults(userGolfPicks, apiData) {
    if(!this.sportsApi.getApiData()){
      this.sportsApi.setApiData(apiData)
    }
    this.entries = 0;
    this.status = apiData.status;
    this.currentRound = apiData.round;

    for (const userGolfKey of userGolfPicks) {
      if (userGolfKey.eventId !== this.sportsApi.getEventId()) {
        continue;
      }
      this.entries++;
      const fantasyLeader = {} as ILeaderResults;
      let pgaPlayer = {} as any;
      fantasyLeader.team = userGolfKey.team;

      fantasyLeader.score = 0;
      /**4 rounds, 5 golfers, 18 holes */
      if (apiData.round === 4) {
        fantasyLeader.holesRemain = 1 * 5 * 18;
      } else if (apiData.round === 3) {
        fantasyLeader.holesRemain = 2 * 5 * 18;
      } else if (apiData.round === 2) {
        fantasyLeader.holesRemain = 3 * 5 * 18;
      } else {
        fantasyLeader.holesRemain = 4 * 5 * 18;
      }

      this.pgaTournyRespPlayers = apiData.golfers;
      this.picks = [];

      // Golfer1
      pgaPlayer = this.pgaTournyRespPlayers.find(player => player.golferId == userGolfKey.golfer1.toString());
      this.setPlayerPicks(pgaPlayer);

      // Golfer2
      pgaPlayer = this.pgaTournyRespPlayers.find(player => player.golferId == userGolfKey.golfer2.toString());
      this.setPlayerPicks(pgaPlayer);

      // Golfer3
      pgaPlayer = this.pgaTournyRespPlayers.find(player => player.golferId == userGolfKey.golfer3.toString());
      this.setPlayerPicks(pgaPlayer);

      // Golfer4
      pgaPlayer = this.pgaTournyRespPlayers.find(player => player.golferId == userGolfKey.golfer4.toString());
      this.setPlayerPicks(pgaPlayer);

      // Golfer5
      pgaPlayer = this.pgaTournyRespPlayers.find(player => player.golferId == userGolfKey.golfer5.toString());
      this.setPlayerPicks(pgaPlayer);

      // Golfer6
      pgaPlayer = this.pgaTournyRespPlayers.find(player => player.golferId == userGolfKey.golfer6.toString());
      this.setPlayerPicks(pgaPlayer);

      // Golfer7
      pgaPlayer = this.pgaTournyRespPlayers.find(player => player.golferId === userGolfKey.golfer7.toString());
      this.setPlayerPicks(pgaPlayer);

      // Golfer8
      pgaPlayer = this.pgaTournyRespPlayers.find(player => player.golferId === userGolfKey.golfer8.toString());
      this.setPlayerPicks(pgaPlayer);

      /**This is where we will check how many active golfers are left */
      let golferScore: number;
      let i = 0;
      let remain = 0;
      let j = 0;
      this.picks = sortScores(this.picks);

      if (this.isTournyActive()) {
        this.golferItems = [];
        for (const pick of this.picks) {
          const golferItem = {} as IPlayer;
          j++;
          fantasyLeader['id' + j] = pick.golferId;
          golferItem.golferId = pick.golferId;
          golferItem.name = pick.golferName;
          golferItem.round = pick.round;
          golferItem.status = pick.status;
          golferItem.imageLink = pick.imageLink;
          if (this.sportsApi.isGolferActive(pick.status)) {
            if (i < 5) {
              i++;
              golferScore = pick.score;
              // if (pick.score.toString() !== '--') {
                fantasyLeader.score = +fantasyLeader.score + +golferScore;
              // }
              fantasyLeader.holesRemain = fantasyLeader.holesRemain - pick.thru;
            }
            remain++;
            if (pick.thru === 18) { golferItem.thru = 'F'; } else {
              if (pick.thru !== null) {
                golferItem.thru = 'Thru' + ' ' + pick.thru;
              } else {
                golferItem.thru = 'Thru 0';
              }
            }
            golferItem.score = pick.score;
          } else {
            golferItem.score = 99;
            golferItem.thru = 'CUT';
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
    if (this.fantasyLeaders.length > 0) {
      this.fantasyLeaders = sortScores(this.fantasyLeaders);
    }
    this.dataSource = this.fantasyLeaders;
    this.rankEntries();
  }

  private rankEntries() {
    let position = 0;
    let dupPos = 0;
    let prevScore = 999;
    for (const fantasyLeader of this.fantasyLeaders) {
      if (fantasyLeader.score === prevScore) {
        fantasyLeader.position = position;
        dupPos++;
      } else {
        position++;
        position = position + dupPos;
        dupPos = 0;
        fantasyLeader.position = position;
      }
      prevScore = fantasyLeader.score;

      /** This will iterate through the golfers and map the value of  */
      for (const golferKey of fantasyLeader.golfers) {
        for (const ownKey in this.ownPct) {
          if (this.ownPct[ownKey].golferId === golferKey.golferId) {
            golferKey.ownPct = this.ownPct[ownKey].count / this.entries * 100;
          }
        }
      }
    }
  }

  openPopup(golferId: string, status: string, playerName: string) {
    if (!this.sportsApi.isGolferActive(status)) {
      this.openSnackBar();
      return;
    }

    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = { golfer: golferId, roundId: this.currentRound, name: playerName };
    const dialogRef = this.popup.open(ScorecardPopComponent, popupConfig);
    dialogRef.afterClosed().subscribe(
    );
  }

  default(err, userGolfPicks) {
    for (const userPick of userGolfPicks) {
      if (userPick.eventId !== this.sportsApi.getEventId()) {
        continue;
      }
      this.entries++;
      const fantasyLeader = {} as ILeaderResults;
      fantasyLeader.team = userPick.team;
      fantasyLeader.holesRemain = 360;
      fantasyLeader.golfersRemain = 8;
      fantasyLeader.score = 99;
      fantasyLeader.golfers = [];
      this.fantasyLeaders.push(fantasyLeader);

      if (this.fantasyLeaders.length > 0) {
        this.fantasyLeaders = sortScores(this.fantasyLeaders);
      }
      this.dataSource = this.fantasyLeaders;
      this.rankEntries();
    }
  }

  isTournyActive(): boolean {
    return this.sportsApi.isTournamentActive(this.status);
  }

  private openSnackBar() {
    const text = Messages.golferCut;
    this.config.duration = 2500;
    this.snackBar.open(text, 'Close', this.config);
  }

}
