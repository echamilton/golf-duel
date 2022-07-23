import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IGolfAppState } from './golf.reducer';

const featureSlice = createFeatureSelector<IGolfAppState>('golfData');

export const getGolfTournamentData = createSelector(featureSlice, (state) => {
  return state.tournamentData!;
});

export const selectLoggedInUser = createSelector(
  featureSlice,
  (state: IGolfAppState) => {
    return state.isLoading;
  }
);

export const getGolferGroups = createSelector(featureSlice, (state) => {
  return state.golferGroupings!;
});

export const getUserPicks = createSelector(featureSlice, (state) => {
  return state.userSelectedPicks!;
});

export const getIsTournamentLoading = createSelector(featureSlice, (state) => {
  return state.isLoading;
});
