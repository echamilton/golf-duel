import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import {
  IGolferDetail,
  IPlayer,
  ILeaderResults,
  ITournamentResults
} from '../../models/models';
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
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  expandedElement: ILeaderResults | null;
  dataSource: any[];
  subscription: Subscription;
  fantasyLeaders: Array<ILeaderResults> = [];
  golferItems: Array<IPlayer> = [];
  ownPct: Array<IGolferDetail> = [];
  status: string;
  entries: number;
  config = new MatSnackBarConfig();

  constructor(
    private popup: MatDialog,
    private sportsApi: SportsApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscription = this.sportsApi
      .getGolferPicks()
      .subscribe((userGolfPicks) => {
        this.getGolferLeaderBoard(userGolfPicks);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get tableColumns(): String[] {
    return LeaderColumns;
  }

  getGolferLeaderBoard(contestants): void {
    this.sportsApi.getGolfScores().subscribe(
      (tournamentResults: ITournamentResults) => {
        this.buildResults(contestants, tournamentResults);
      },
      (err) => {
        this.default(err, contestants);
      }
    );
  }

  updatePercentageOwned(playerPick: IPlayer): void {
    const ownPct = this.ownPct.find(
      (golfer) => golfer.golferId === playerPick.golferId
    );
    if (ownPct) {
      ownPct.count++;
    } else {
      const ownPctNew = {} as IGolferDetail;
      ownPctNew.golferId = playerPick.golferId;
      ownPctNew.count = 1;
      this.ownPct.push(ownPctNew);
    }
  }

  buildResults(contestants, tournamentResults: ITournamentResults): void {
    this.sportsApi.setApiData(tournamentResults);
    this.entries = 0;
    this.status = tournamentResults.status;

    for (const contestant of contestants) {
      if (contestant.eventId !== this.sportsApi.getEventId()) {
        continue;
      }
      this.entries++;
      const fantasyLeader = {} as ILeaderResults;
      fantasyLeader.team = contestant.team;
      fantasyLeader.score = 0;
      /**4 rounds, 5 golfers, 18 holes */
      if (Number(tournamentResults.round) === 4) {
        fantasyLeader.holesRemain = 1 * 5 * 18;
      } else if (Number(tournamentResults.round) === 3) {
        fantasyLeader.holesRemain = 2 * 5 * 18;
      } else if (Number(tournamentResults.round) === 2) {
        fantasyLeader.holesRemain = 3 * 5 * 18;
      } else {
        fantasyLeader.holesRemain = 4 * 5 * 18;
      }

      const contestantPicks = [];
      let pgaPlayer = {} as any;

      // Golfer1
      pgaPlayer = tournamentResults.golfers.find(
        (player: IPlayer) => player.golferId == contestant.golfer1.toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }

      // Golfer2
      pgaPlayer = tournamentResults.golfers.find(
        (player) => player.golferId == contestant.golfer2.toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }

      // Golfer3
      pgaPlayer = tournamentResults.golfers.find(
        (player) => player.golferId == contestant.golfer3.toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }

      // Golfer4
      pgaPlayer = tournamentResults.golfers.find(
        (player) => player.golferId == contestant.golfer4.toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }

      // Golfer5
      pgaPlayer = tournamentResults.golfers.find(
        (player) => player.golferId == contestant.golfer5.toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }

      // Golfer6
      pgaPlayer = tournamentResults.golfers.find(
        (player) => player.golferId == contestant.golfer6.toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }

      // Golfer7
      pgaPlayer = tournamentResults.golfers.find(
        (player) => player.golferId === contestant.golfer7.toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }

      // Golfer8
      pgaPlayer = tournamentResults.golfers.find(
        (player) => player.golferId === contestant.golfer8.toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }

      /**This is where we will check how many active golfers are left */
      let golferScore: number;
      let i = 0;
      let remain = 0;
      let j = 0;
      sortScores(contestantPicks);

      if (this.isTournyActive()) {
        this.golferItems = [];
        for (const pick of contestantPicks) {
          const golferItem = {} as IPlayer;
          j++;
          fantasyLeader['id' + j] = pick.golferId;
          golferItem.golferId = pick.golferId;
          golferItem.name = pick.name;
          golferItem.round = pick.round;
          golferItem.status = pick.status;
          golferItem.imageLink = pick.imageLink;
          if (this.sportsApi.isGolferActive(pick.status)) {
            if (i < 5) {
              i++;
              golferScore = pick.score;
              fantasyLeader.score = +fantasyLeader.score + +golferScore;
              fantasyLeader.holesRemain = fantasyLeader.holesRemain - pick.thru;
            }
            remain++;
            if (pick.thru === 18) {
              golferItem.thru = 'F';
            } else {
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

  private rankEntries(): void {
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
            golferKey.ownPct = (this.ownPct[ownKey].count / this.entries) * 100;
          }
        }
      }
    }
  }

  openPopup(golferId: string, status: string, playerName: string): void {
    if (!this.sportsApi.isGolferActive(status)) {
      this.openSnackBar();
      return;
    }

    const popupConfig = new MatDialogConfig();
    popupConfig.disableClose = false;
    popupConfig.autoFocus = true;
    popupConfig.data = {
      golfer: golferId,
      name: playerName
    };
    const dialogRef = this.popup.open(ScorecardPopComponent, popupConfig);
    dialogRef.afterClosed().subscribe();
  }

  default(err, userGolfPicks): void {
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

  private openSnackBar(): void {
    const text = Messages.golferCut;
    this.config.duration = 2500;
    this.snackBar.open(text, 'Close', this.config);
  }
}
