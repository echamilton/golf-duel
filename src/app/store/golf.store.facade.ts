import { EventEmitter, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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

  loadGolferGroupings(): void {
    this.store.dispatch(getGolferGroupings());
  }

  loadUserPicks(): void {
    this.store.dispatch(getUserSelectedPicks());
  }

  updateUserPicks(userSelections: IUserGolfPicks): void {
    this.store.dispatch(updateUserSelectedPicks());
  }

  triggerRefreshData(): void {
    this.refreshData.emit(true);
  }

  isDataRefreshed(): EventEmitter<boolean> {
    return this.refreshData;
  }
}
