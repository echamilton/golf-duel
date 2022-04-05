import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  IOwnershipPerGolfer,
  IPlayer,
  ILeaderResults,
  ITournamentResults,
  IUserGolfPicks,
  IGolferGroupingsUI,
  IGolfersGroupPick
} from '../../models/models';
import { INITIALIZED_VALUE, LeaderColumns } from './../../models/constants';
import { sortScores } from './../../utilities/sorter';
import { GolfDataStoreService } from 'src/app/services/golf-data-store.service';
import { GolfStoreFacade } from 'src/app/store/golf.store.facade';
import { cloneDeep } from 'lodash';
import { buildPlayerList } from './../../utilities/player-generator';

@Component({
  selector: 'app-leaderboard',
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
  expandedElement: ILeaderResults | null = null;
  dataSource: ILeaderResults[] = [];
  fantasyLeaders: Array<ILeaderResults> = [];
  ownPct: Array<IOwnershipPerGolfer> = [];
  golferGroups: IGolferGroupingsUI = {};
  isTournyActive = false;
  isLoading = false;

  constructor(
    private golfDataStoreService: GolfDataStoreService,
    private golfFacade: GolfStoreFacade
  ) {
    this.golfFacade
      .isDataRefreshed()
      .subscribe(() => this.initializeLeaderboard());

    this.golfFacade
      .getGolferGroups()
      .subscribe((groupsState: IGolferGroupingsUI) => {
        this.golferGroups = groupsState;
      });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.golfDataStoreService.getGolferPicks().subscribe((userGolfPicks) => {
      this.getGolferLeaderBoard(userGolfPicks);
      this.isLoading = false;
    });
  }

  get tableColumns(): String[] {
    return LeaderColumns;
  }

  get isTournamentActive(): boolean {
    return this.isTournyActive;
  }

  private getGolferLeaderBoard(contestants: IUserGolfPicks[]): void {
    this.golfFacade
      .getTournamentData()
      .subscribe((results: ITournamentResults) => {
        const tournamentResults: ITournamentResults = cloneDeep(results);
        if (tournamentResults) {
          buildPlayerList(tournamentResults.golfers); // TAKE OUT
          this.initializeLeaderboard();
          this.buildResults(contestants, tournamentResults);
          this.isLoading = false;
        }
      });
  }

  private initializeLeaderboard(): void {
    this.fantasyLeaders = [];
    this.ownPct = [];
    this.isLoading = true;
  }

  private updatePercentageOwned(playerPick: IPlayer): void {
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

  private buildResults(
    contestants: IUserGolfPicks[],
    tournamentResults: ITournamentResults
  ): void {
    this.isTournyActive = tournamentResults.isTournamentActive;

    for (const contestant of contestants) {
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

      const contestantPicks: IPlayer[] = this.buildContestantGolferScores(
        contestant,
        tournamentResults
      );

      /**This is where we will check number of active golfers are left */
      let i = 0;
      let remain = 0;
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
          // @ts-ignore
          player.golferId == contestant[golferIndetifier].toString()
      );
      if (pgaPlayer) {
        pgaPlayer.group = this.findGroupForPlayer(pgaPlayer.golferId);
        contestantPicks.push(pgaPlayer);
        this.updatePercentageOwned(pgaPlayer);
      }
      i++;
    }
    sortScores(contestantPicks);
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

  private findGroupForPlayer(golferId: string): string {
    let playerRecord: IGolfersGroupPick;

    playerRecord = this.golferGroups.groupA?.find(
      (player) => player.id == golferId
    )!;
    if (playerRecord) {
      return 'A';
    }

    playerRecord = this.golferGroups.groupB?.find(
      (player) => player.id == golferId
    )!;
    if (playerRecord) {
      return 'B';
    }

    playerRecord = this.golferGroups.groupC?.find(
      (player) => player.id == golferId
    )!;
    if (playerRecord) {
      return 'C';
    }

    return INITIALIZED_VALUE;
  }

  private determineHolesRemaining(currentRound: number): number {
    /**4 rounds, 5 golfers, 18 holes */
    return (5 - (currentRound > 0 ? currentRound : 1)) * (5 * 18);
  }
}
