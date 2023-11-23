import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  getGolferGroupings,
  getGolferGroupingsComplete,
  getGolferScorecard,
  getGolferScorecardComplete,
  getTournamentLoad,
  getTournamentLoadSuccess,
  getUserSelectedPicks,
  getUserSelectedPicksComplete,
  updateUserSelectedPicks,
  updateUserSelectedPicksComplete
} from './golf.actions';
import { map, mergeMap } from 'rxjs/operators';
import {
  IEntriesGolferDataStore,
  IGolferGroupingsUI,
  IScoreCard,
  IUserGolfPicks
} from './../models/models';
import { Operation } from '../models/constants';
import { environment } from './../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private httpService: HttpClient,
    private authService: AuthService
  ) {}

  getTournamentData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(getTournamentLoad),
      mergeMap(() =>
        this.httpService.get(environment.leaderBoardApiUrl).pipe(
          map((tournamentResults: any) => {
            return getTournamentLoadSuccess(tournamentResults);
          })
        )
      )
    )
  );

  getGolferGroupings$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(getGolferGroupings),
      mergeMap(() =>
        this.httpService.get(environment.playerGroupingsUrl).pipe(
          map((golfGroupings: IGolferGroupingsUI) => {
            return getGolferGroupingsComplete(golfGroupings);
          })
        )
      )
    )
  );

  getUserSelectedPicks$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserSelectedPicks),
      mergeMap(() =>
        this.httpService
          .get(environment.entriesApiUrl, { headers: this.buildHeader() })
          .pipe(
            map((response) => {
              const allUserPicks: IEntriesGolferDataStore =
                response as IEntriesGolferDataStore;
              return getUserSelectedPicksComplete({
                picks: allUserPicks.userEntry,
                allUserPicks: allUserPicks.allEntries
              });
            })
          )
      )
    )
  );

  updateUserSelectedPicks$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserSelectedPicks),
      mergeMap((action) =>
        this.updateUserPicks(action.picks, action.operation).pipe(
          map(() => {
            return updateUserSelectedPicksComplete();
          })
        )
      )
    )
  );

  getGolferScorecard$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(getGolferScorecard),
      mergeMap((params) =>
        this.httpService
          .get(
            `${environment.leaderBoardApiUrl}/${params.golferId}/scorecard?round=${params.round}`
          )
          .pipe(
            map((scorecard: IScoreCard) => {
              return getGolferScorecardComplete({ golferScorecard: scorecard });
            })
          )
      )
    )
  );

  private updateUserPicks(
    picks: IUserGolfPicks,
    operation: Operation
  ): Observable<boolean> {
    if (operation === Operation.update)
      return this.httpService
        .post(environment.entriesApiUrl, picks, {
          headers: this.buildHeader()
        })
        .pipe(
          map(() => {
            return true;
          })
        );
    else {
      return this.httpService
        .delete(environment.entriesApiUrl, {
          headers: this.buildHeader()
        })
        .pipe(
          map(() => {
            return true;
          })
        );
    }
  }

  private buildHeader(): HttpHeaders {
    return new HttpHeaders({ userId: this.authService.getCurrentUser() });
  }
}
