import { props, createAction } from '@ngrx/store';
import {
  ITournamentResults,
  IGolferGroupingsUI,
  IUserGolfPicks
} from './../models/models';

export const getTournamentLoad = createAction('[Golf] Get tournament Load');
export const getTournamentLoadSuccess = createAction(
  '[Golf] Get tournament Success',
  props<ITournamentResults>()
);
export const getGolferGroupings = createAction('[Golf] Get golfer groupings');
export const getUserSelectedPicks = createAction(
  '[Golf] Get user selected picks'
);
export const getUserSelectedPicksComplete = createAction(
  '[Golf] Get user selected picks success',
  props<IUserGolfPicks>()
);
export const updateUserSelectedPicks = createAction(
  '[Golf] Update user selected picks'
);
export const getGolferGroupingsComplete = createAction(
  '[Golf] Get groupings Success',
  props<IGolferGroupingsUI>()
);
