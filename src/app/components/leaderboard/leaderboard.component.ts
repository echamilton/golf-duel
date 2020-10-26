import { Component, OnInit, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import {
  IOwnershipPerGolfer,
  IPlayer,
  ILeaderResults,
  ITournamentResults,
  IUserGolfPicks
} from '../../models/models';
import { LeaderColumns } from './../../models/constants';
import { sortScores } from './../../utilities/sorter';
import { GolfDataStoreService } from 'src/app/services/golf-data-store.service';
import { GolfStoreFacade } from 'src/app/store/golf.store.facade';

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
export class LeaderboardComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  expandedElement: ILeaderResults | null;
  dataSource: any[];
  fantasyLeaders: Array<ILeaderResults> = [];
  ownPct: Array<IOwnershipPerGolfer> = [];
  isTournyActive = false;

  constructor(
    private golfDataStoreService: GolfDataStoreService,
    private golfFacade: GolfStoreFacade
  ) {}

  ngOnInit(): void {
    this.golfDataStoreService.getGolferPicks().subscribe((userGolfPicks) => {
      this.getGolferLeaderBoard(userGolfPicks);
    });
  }

  get tableColumns(): String[] {
    return LeaderColumns;
  }

  get isTournamentActive(): boolean {
    return this.isTournyActive;
  }

  getGolferLeaderBoard(contestants): void {
    this.golfFacade
      .getTournamentData()
      .subscribe((tournamentResults: ITournamentResults) => {
        if (tournamentResults) {
          this.buildResults(contestants, tournamentResults);
        }
      });
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
    this.isTournyActive = tournamentResults.isTournamentActive;

    for (const contestant of contestants) {
      if (contestant.eventId !== tournamentResults.eventId) {
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

      if (this.isTournyActive) {
        fantasyLeader.golfers = [];
        for (const pick of contestantPicks) {
          if (pick.isActive) {
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
    const contestantPicks = [];

    let i = 1;
    while (i <= 8) {
      const golferIndetifier = `golfer${i}`;
      const pgaPlayer = tournyResults.golfers.find(
        (player: IPlayer) =>
          player.golferId == contestant[golferIndetifier].toString()
      );
      if (pgaPlayer) {
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }
      i++;
    }
    return contestantPicks;
  }

  private rankEntries(): void {
    let position = 0;
    let dupPos = 0;
    let prevScore = 999;
    const totalEntries = this.fantasyLeaders.length;
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
          golferKey.ownPct = (golferSelectedCount.count / totalEntries) * 100;
        }
      }
    }
  }

  private determineHolesRemaining(currentRound: number): number {
    /**4 rounds, 5 golfers, 18 holes */
    let holesRemain = 0;
    const holeMutiplier = 5 * 18;
    if (currentRound === 4) {
      holesRemain = 1 * holeMutiplier;
    } else if (currentRound === 3) {
      holesRemain = 2 * holeMutiplier;
    } else if (currentRound === 2) {
      holesRemain = 3 * holeMutiplier;
    } else {
      holesRemain = 4 * holeMutiplier;
    }
    return holesRemain;
  }
}
