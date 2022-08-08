import { createReducer, on } from '@ngrx/store';
import {
  IGolferGroupingsUI,
  ITournamentResults,
  IUserGolfPicks
} from './../models/models';
import {
  getTournamentLoad,
  getTournamentLoadSuccess,
  getGolferGroupings,
  getGolferGroupingsComplete,
  getUserSelectedPicks,
  getUserSelectedPicksComplete,
  updateUserSelectedPicks,
  updateUserSelectedPicksComplete
} from './golf.actions';

export interface IGolfAppState {
  tournamentData?: ITournamentResults;
  isLoading: boolean;
  golferGroupings?: IGolferGroupingsUI;
  isLoadingGroups: boolean;
  allUserPicks?: Array<IUserGolfPicks>;
  userSelectedPicks?: IUserGolfPicks;
  isUserPicksUpdating: boolean;
}

const INITIAL_STORE_STATE: Readonly<IGolfAppState> = {
  isLoading: false,
  isLoadingGroups: false,
  isUserPicksUpdating: false
};

export const golfReducer = createReducer(
  INITIAL_STORE_STATE,
  on(getTournamentLoad, (state) => ({ ...state, isLoading: true })),
  on(
    getTournamentLoadSuccess,
    (state: IGolfAppState, tournamentData: ITournamentResults) => ({
      ...state,
      tournamentData: tournamentData,
      isLoading: false
    })
  ),
  on(getGolferGroupings, (state) => ({ ...state, isLoadingGroups: true })),
  on(getGolferGroupingsComplete, (state, groupings: IGolferGroupingsUI) => ({
    ...state,
    isLoadingGroups: false,
    golferGroupings: groupings
  })),
  on(getUserSelectedPicks, (state) => ({
    ...state
  })),
  on(updateUserSelectedPicks, (state, action) => ({
    ...state,
    userSelectedPicks: action.picks,
    isUserPicksUpdating: true
  })),
  on(updateUserSelectedPicksComplete, (state) => ({
    ...state,
    isUserPicksUpdating: false
  })),
  on(getUserSelectedPicksComplete, (state, action) => ({
    ...state,
    userSelectedPicks: action.picks,
    allUserPicks: action.allUserPicks
  }))
);
