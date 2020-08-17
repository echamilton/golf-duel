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
  IOwnershipPerGolfer,
  IPlayer,
  ILeaderResults,
  ITournamentResults,
  IUserGolfPicks
} from '../../models/models';
import { SportsApiService } from '../../services/sports-api';
import {
  Messages,
  LeaderColumns,
  GolferStatus
} from './../../models/constants';
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
  fantasyLeaders: Array<ILeaderResults> = [];
  ownPct: Array<IOwnershipPerGolfer> = [];
  status: string;
  entries: number = 0;
  config = new MatSnackBarConfig();

  constructor(
    private popup: MatDialog,
    private sportsApi: SportsApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sportsApi.getGolferPicks().subscribe((userGolfPicks) => {
      this.getGolferLeaderBoard(userGolfPicks);
    });
  }

  ngOnDestroy(): void {}

  get tableColumns(): String[] {
    return LeaderColumns;
  }

  get golferCutStatus(): string {
    return GolferStatus.cut;
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
      const ownPctNew: IOwnershipPerGolfer = {
        golferId: playerPick.golferId,
        count: 1
      };
      this.ownPct.push(ownPctNew);
    }
  }

  buildResults(contestants, tournamentResults: ITournamentResults): void {
    this.sportsApi.setApiData(tournamentResults);
    this.status = tournamentResults.status;
    this.entries = contestants.length;

    for (const contestant of contestants) {
      if (contestant.eventId !== this.sportsApi.getActiveEventId()) {
        continue;
      }
      const fantasyLeader: ILeaderResults = {
        position: 0,
        team: contestant.team,
        score: 0,
        holesRemain: this.determineHolesRemaining(
          Number(tournamentResults.round)
        ),
        golfersRemain: 0,
        golfers: []
      };

      const contestantPicks = this.buildContestantGolferScores(
        contestant,
        tournamentResults
      );

      /**This is where we will check how many active golfers are left */
      let i = 0;
      let remain = 0;
      sortScores(contestantPicks);

      if (this.isTournyActive()) {
        fantasyLeader.golfers = [];
        for (const pick of contestantPicks) {
          if (this.sportsApi.isGolferActive(pick.status)) {
            if (i < 5) {
              i++;
              fantasyLeader.score = +fantasyLeader.score + +pick.score;
              fantasyLeader.holesRemain =
                fantasyLeader.holesRemain - Number(pick.thru);
            }
            remain++;
          } else {
            pick.thru = 'CUT';
          }
          fantasyLeader.golfers.push(pick);
        }
      } else {
        /**Default to 8 active golfers and 99 score when golf tourny not active */
        remain = 8;
        fantasyLeader.score = 99;
      }

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

  private buildContestantGolferScores(
    contestant: IUserGolfPicks,
    tournyResults: ITournamentResults
  ): IPlayer[] {
    let pgaPlayer = {} as any;
    const contestantPicks = [];

    // Golfer1
    pgaPlayer = tournyResults.golfers.find(
      (player: IPlayer) => player.golferId == contestant.golfer1.toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      this.updatePercentageOwned(pgaPlayer);
    }

    // Golfer2
    pgaPlayer = tournyResults.golfers.find(
      (player) => player.golferId == contestant.golfer2.toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      this.updatePercentageOwned(pgaPlayer);
    }

    // Golfer3
    pgaPlayer = tournyResults.golfers.find(
      (player) => player.golferId == contestant.golfer3.toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      this.updatePercentageOwned(pgaPlayer);
    }

    // Golfer4
    pgaPlayer = tournyResults.golfers.find(
      (player) => player.golferId == contestant.golfer4.toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      this.updatePercentageOwned(pgaPlayer);
    }

    // Golfer5
    pgaPlayer = tournyResults.golfers.find(
      (player) => player.golferId == contestant.golfer5.toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      this.updatePercentageOwned(pgaPlayer);
    }

    // Golfer6
    pgaPlayer = tournyResults.golfers.find(
      (player) => player.golferId == contestant.golfer6.toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      this.updatePercentageOwned(pgaPlayer);
    }

    // Golfer7
    pgaPlayer = tournyResults.golfers.find(
      (player) => player.golferId === contestant.golfer7.toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      this.updatePercentageOwned(pgaPlayer);
    }

    // Golfer8
    pgaPlayer = tournyResults.golfers.find(
      (player) => player.golferId === contestant.golfer8.toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      this.updatePercentageOwned(pgaPlayer);
    }
    return contestantPicks;
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
        const golferSelectedCount = this.ownPct.find(
          (record) => record.golferId === golferKey.golferId
        );
        if (golferSelectedCount) {
          golferKey.ownPct = (golferSelectedCount.count / this.entries) * 100;
        }
      }
    }
  }

  private determineHolesRemaining(currentRound: number): number {
    /**4 rounds, 5 golfers, 18 holes */
    let holesRemain = 0;
    if (currentRound === 4) {
      holesRemain = 1 * 5 * 18;
    } else if (currentRound === 3) {
      holesRemain = 2 * 5 * 18;
    } else if (currentRound === 2) {
      holesRemain = 3 * 5 * 18;
    } else {
      holesRemain = 4 * 5 * 18;
    }
    return holesRemain;
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

  default(err, contestants): void {
    for (const userPick of contestants) {
      if (userPick.eventId !== this.sportsApi.getActiveEventId()) {
        continue;
      }
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
