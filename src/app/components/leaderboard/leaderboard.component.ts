import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { IOwnershipPerGolfer, ILeaderResults } from '../../models/models';
import { LeaderColumns } from './../../models/constants';
import { GolfStoreFacade } from '../../store/golf.store.facade';
import {
  rankEntries,
  buildLeaderboardResults
} from '../../utilities/player-team-util';
import { cloneMe } from './../../utilities/generic-util';

@Component({
  selector: 'golf-leaderboard',
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
  fantasyLeaders: Array<ILeaderResults> = [];
  ownPct: Array<IOwnershipPerGolfer> = [];
  isTournyActive = false;
  isLoading = false;

  constructor(private golfFacade: GolfStoreFacade) {
    this.golfFacade
      .isDataRefreshed()
      .subscribe(() => this.initializeLeaderboard());
  }

  ngOnInit(): void {
    this.initializeLeaderboard();
    this.buildGolferLeaderBoard();
  }

  get tableColumns(): String[] {
    return LeaderColumns;
  }

  get isTournamentActive(): boolean {
    return this.isTournyActive;
  }

  buildGolferLeaderBoard(): void {
    this.isLoading = true;
    this.golfFacade.getLeaderboardData().subscribe(([results, contestants]) => {
      if (results && contestants) {
        const tournamentResults = cloneMe(results);

        console.log('double method hit on reload');
        this.fantasyLeaders = buildLeaderboardResults(
          contestants,
          tournamentResults,
          this.ownPct
        );

        this.fantasyLeaders = rankEntries(this.fantasyLeaders, this.ownPct);
        this.isTournyActive = tournamentResults.isTournamentActive;
        this.isLoading = false;
      }
    });
  }

  initializeLeaderboard(): void {
    this.fantasyLeaders = [];
    this.ownPct = [];
    this.isLoading = true;
  }
}
