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
  getUserSelectedPicksComplete
} from './golf.actions';

export interface IGolfAppState {
  tournamentData?: ITournamentResults;
  isLoading: boolean;
  golferGroupings?: IGolferGroupingsUI;
  isLoadingGroups: boolean;
  userSelectedPicks?: IUserGolfPicks;
}

const INITIAL_STORE_STATE: Readonly<IGolfAppState> = {
  isLoading: false,
  isLoadingGroups: false
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
  on(
    getUserSelectedPicksComplete,
    (state, userSelectedPicks: IUserGolfPicks) => ({
      ...state,
      userSelectedPicks: userSelectedPicks
    })
  )
);
