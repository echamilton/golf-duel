import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import {
  getGolferGroupings,
  getGolferGroupingsComplete,
  getTournamentLoad,
  getTournamentLoadSuccess,
  getUserSelectedPicks,
  getUserSelectedPicksComplete,
  updateUserSelectedPicks,
  updateUserSelectedPicksComplete
} from './golf.actions';
import { map, mergeMap } from 'rxjs/operators';
import {
  IGolferGrouping,
  IGolferGroupingsUI,
  IGolfersGroupPick,
  ITournamentResults
} from './../models/models';
import { SportsApiService } from '../services/sports-api.service';
import { GolfDataStoreService } from '../services/golf-data-store.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private sportsApi: SportsApiService,
    private golfData: GolfDataStoreService
  ) {}

  getTournamentData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(getTournamentLoad),
      mergeMap(() =>
        this.sportsApi.getGolfScores().pipe(
          map((tournamentResults: ITournamentResults) => {
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
        this.golfData.getGolferGroupings().pipe(
          map((golfGroupings) => {
            return getGolferGroupingsComplete(
              this.filterGolfGroupings(golfGroupings)
            );
          })
        )
      )
    )
  );

  getUserSelectedPicks$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserSelectedPicks),
      mergeMap(() =>
        this.golfData.loadUserPicks().pipe(
          map((userPicks) => {
            return getUserSelectedPicksComplete(userPicks);
          })
        )
      )
    )
  );

  updateUserSelectedPicks$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserSelectedPicks),
      mergeMap((action) =>
        this.golfData.updateGolferPicks(action).pipe(
          map(() => {
            return updateUserSelectedPicksComplete();
          })
        )
      )
    )
  );

  private filterGolfGroupings(
    groupingsFromDB: IGolferGrouping[]
  ): IGolferGroupingsUI {
    const golferGroupings: IGolferGroupingsUI = {
      groupA: [],
      groupB: [],
      groupC: []
    };

    if (groupingsFromDB) {
      groupingsFromDB.forEach((golfer) => {
        const golferPick: IGolfersGroupPick = {
          id: golfer.golferId,
          name: golfer.name
        };

        if (golfer.group == 'A') {
          golferGroupings.groupA!.push(golferPick);
        } else if (golfer.group == 'B') {
          golferGroupings.groupB!.push(golferPick);
        } else {
          golferGroupings.groupC!.push(golferPick);
        }
      });
    }
    return golferGroupings;
  }
}
