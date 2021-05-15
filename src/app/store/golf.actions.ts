import { props, createAction } from '@ngrx/store';
import { ITournamentResults, IGolferGroupingsUI } from './../models/models';

export const getTournamentLoad = createAction('[Golf] Get tournament Load');
export const getTournamentLoadSuccess = createAction(
  '[Golf] Get tournament Success',
  props<ITournamentResults>()
);
export const getGolferGroupings = createAction('[Golf] Get golfer groupings');
export const getGolferGroupingsComplete = createAction(
  '[Golf] Get groupings Success',
  props<IGolferGroupingsUI>()
);
