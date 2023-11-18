import { EventEmitter, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { Operation } from '../models/constants';
import {
  IGolferGroupingsUI,
  ITournamentResults,
  IUserGolfPicks
} from '../models/models';
import {
  getGolferGroupings,
  getGolferScorecard,
  getTournamentLoad,
  getUserSelectedPicks,
  updateUserSelectedPicks
} from './golf.actions';
import {
  getAllUserPicks,
  getAreGroupsLoading,
  getGolferGroups,
  getGolfTournamentData,
  getIsTournamentLoading,
  getUserPicks,
  getGolferScorecardData
} from './golf.selector';

@Injectable({
  providedIn: 'root'
})
export class GolfStoreFacade {
  refreshData: EventEmitter<boolean> = new EventEmitter();
  constructor(private store: Store) {}

  loadTournamentData(): void {
    this.store.dispatch(getTournamentLoad());
  }

  getTournamentData(): Observable<ITournamentResults> {
    return this.store.select(getGolfTournamentData);
  }

  getLoadingIndicator(): Observable<boolean> {
    return this.store.select(getIsTournamentLoading);
  }

  getGolferGroups(): Observable<IGolferGroupingsUI> {
    return this.store.select(getGolferGroups);
  }

  getUserSelectedPicks(): Observable<IUserGolfPicks> {
    return this.store.select(getUserPicks);
  }

  loadGolferGroupings(): void {
    this.store.dispatch(getGolferGroupings());
  }

  loadUserPicks(): void {
    this.store.dispatch(getUserSelectedPicks());
  }

  getAreGroupsLoading(): Observable<boolean> {
    return this.store.select(getAreGroupsLoading);
  }

  updateUserPicks(userSelections: IUserGolfPicks, operation: Operation): void {
    this.store.dispatch(
      updateUserSelectedPicks({ picks: userSelections, operation: operation })
    );
  }

  triggerRefreshData(): void {
    this.refreshData.emit(true);
  }

  isDataRefreshed(): EventEmitter<boolean> {
    return this.refreshData;
  }

  getToolbarValidationData(): Observable<any> {
    return combineLatest([
      this.store.select(getGolfTournamentData),
      this.store.select(getUserPicks)
    ]);
  }

  getLeaderboardData(): Observable<any> {
    return combineLatest([
      this.store.select(getGolfTournamentData),
      this.store.select(getAllUserPicks)
    ]);
  }

  loadGolferScorecard(golferId: string, round: string): void {
    this.store.dispatch(getGolferScorecard({ golferId, round }));
  }

  getGolferScorecard(): Observable<any> {
    return this.store.select(getGolferScorecardData);
  }
}
