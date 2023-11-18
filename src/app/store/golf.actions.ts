import { props, createAction } from '@ngrx/store';
import { Operation } from '../models/constants';
import {
  ITournamentResults,
  IGolferGroupingsUI,
  IUserGolfPicks,
  IScoreCard
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
  props<{ picks: IUserGolfPicks; allUserPicks: Array<IUserGolfPicks> }>()
);
export const updateUserSelectedPicks = createAction(
  '[Golf] Update user selected picks',
  props<{ picks: IUserGolfPicks; operation: Operation }>()
);
export const updateUserSelectedPicksComplete = createAction(
  '[Golf] Update user selected picks complete'
);
export const getGolferGroupingsComplete = createAction(
  '[Golf] Get groupings complete',
  props<IGolferGroupingsUI>()
);
export const getGolferScorecard = createAction(
  '[Golf] Get golfer scorecard',
  props<{ golferId: string; round: string }>()
);
export const getGolferScorecardComplete = createAction(
  '[Golf] Get golfer scorecard complete',
  props<{ golferScorecard: IScoreCard }>()
);
