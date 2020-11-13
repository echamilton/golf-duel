import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IGolferGroupingsUI, ITournamentResults } from '../models/models';
import { GetGolferGroupings, GetTournamentLoad } from './golf.actions';
import {
  getGolferGroups,
  getGolfTournamentData,
  getIsTournamentLoading
} from './golf.selector';

@Injectable({
  providedIn: 'root'
})
export class GolfStoreFacade {
  constructor(private store: Store) {}

  loadTournamentData(): void {
    this.store.dispatch(new GetTournamentLoad());
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

  loadGolferGroupings(): void {
    this.store.dispatch(new GetGolferGroupings());
  }
}
