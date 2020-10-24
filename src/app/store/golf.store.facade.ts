import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ITournamentResults } from '../models/models';
import { GetTournamentLoad } from './golf.actions';
import { getGolfTournamentData } from './golf.selector';

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
}
