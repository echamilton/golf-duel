import { ITournamentResults } from './../models/models';
import { GolfActions, GolfActionTypes } from './golf.actions';

export interface IGolfAppState {
  tournamentData: ITournamentResults;
  isLoading: boolean;
}

export const INITIAL_STORE_STATE: IGolfAppState = {
  tournamentData: null,
  isLoading: false
};

export function reducer(
  state = INITIAL_STORE_STATE,
  action: GolfActions
): IGolfAppState {
  switch (action.type) {
    case GolfActionTypes.GetTournamentDataLoad: {
      return {
        ...state,
        isLoading: true
      };
    }

    case GolfActionTypes.GetTournamentDataSuccess: {
      return {
        ...state,
        tournamentData: action.payload,
        isLoading: false
      };
    }
    default:
      return state;
  }
}
