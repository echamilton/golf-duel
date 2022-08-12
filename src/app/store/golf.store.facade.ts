import { EventEmitter, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { Operation } from '../models/constants';
import {
  IGolferGroupingsUI,
  ITournamentResults,
  IUserGolfPicks
} from '../models/models';
import {
  getGolferGroupings,
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
  getUserPicks
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
    return this.store.pipe(select(getGolfTournamentData));
  }

  getLoadingIndicator(): Observable<boolean> {
    return this.store.pipe(select(getIsTournamentLoading));
  }

  getGolferGroups(): Observable<IGolferGroupingsUI> {
    return this.store.pipe(select(getGolferGroups));
  }

  getUserSelectedPicks(): Observable<IUserGolfPicks> {
    return this.store.pipe(select(getUserPicks));
  }

  getAllUserSelectedPicks(): Observable<IUserGolfPicks[]> {
    return this.store.pipe(select(getAllUserPicks));
  }

  loadGolferGroupings(): void {
    this.store.dispatch(getGolferGroupings());
  }

  loadUserPicks(): void {
    this.store.dispatch(getUserSelectedPicks());
  }

  getAreGroupsLoading(): Observable<boolean> {
    return this.store.pipe(select(getAreGroupsLoading));
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
      this.store.pipe(select(getGolfTournamentData)),
      this.store.pipe(select(getUserPicks))
    ]);
  }

  getLeaderboardData(): Observable<any> {
    return combineLatest([
      this.store.pipe(select(getGolfTournamentData)),
      this.store.pipe(select(getAllUserPicks))
    ]);
  }
}
