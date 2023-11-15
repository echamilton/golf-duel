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
  ITournamentResults,
  IUserGolfPicks
} from './../models/models';
import { SportsApiService } from '../services/sports-api.service';
import { GolfDataStoreService } from '../services/golf-data-store.service';
import { Operation } from '../models/constants';

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
        this.sportsApi.getTournamentLeaderboard().pipe(
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
        this.golfData.getGolferPicks().pipe(
          map((allUserPicks) => {
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

  private updateUserPicks(
    picks: IUserGolfPicks,
    operation: Operation
  ): Observable<boolean> {
    if (operation === Operation.update)
      return this.golfData.updateGolferPicks(picks);
    else {
      return this.golfData.deleteGolferPicks(picks);
    }
  }

  private filterGolfGroupings(
    groupingsFromDB: IGolferGrouping[]
  ): IGolferGroupingsUI {
    return this.splitGroupings(groupingsFromDB);
  }

  private splitGroupings(groupingsDb: IGolferGrouping[]): IGolferGroupingsUI {
    const golferGroupings: IGolferGroupingsUI = {
      groupA: [],
      groupB: [],
      groupC: []
    };
    if (groupingsDb) {
      groupingsDb.forEach((golfer) => {
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
