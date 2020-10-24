import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import * as golfActions from './golf.actions';
import { map, mergeMap } from 'rxjs/operators';
import { ITournamentResults } from './../models/models';
import { SportsApiService } from '../services/sports-api.service';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private sportsApi: SportsApiService) {}

  @Effect()
  getTournamentData$: Observable<Action> = this.actions$.pipe(
    ofType(golfActions.GolfActionTypes.GetTournamentDataLoad),
    mergeMap(() =>
      this.sportsApi.getGolfScores().pipe(
        map((tournamentResults: ITournamentResults) => {
          return new golfActions.GetTournamentSuccess(tournamentResults);
        })
      )
    )
  );
}
