import { IGolferGroupingsUI, ITournamentResults } from './../models/models';
import { GolfActions, GolfActionTypes } from './golf.actions';

export interface IGolfAppState {
  tournamentData: ITournamentResults;
  isLoading: boolean;
  golferGroupings: IGolferGroupingsUI;
  isLoadingGroups: boolean;
}

export const INITIAL_STORE_STATE: IGolfAppState = {
  tournamentData: null,
  isLoading: false,
  golferGroupings: null,
  isLoadingGroups: false
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
    case GolfActionTypes.GetGolferGroupings: {
      return {
        ...state,
        isLoadingGroups: true
      };
    }
    case GolfActionTypes.GetGolferGroupingsComp: {
      return {
        ...state,
        isLoadingGroups: false,
        golferGroupings: action.payload
      };
    }
    default:
      return state;
  }
}
