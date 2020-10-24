import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IGolfAppState } from './golf.reducer';

const featureSlice = createFeatureSelector<IGolfAppState>('golfData');

export const getGolfTournamentData = createSelector(featureSlice, (state) => {
  return state.tournamentData;
});

export const getIsTournamentLoading = createSelector(featureSlice, (state) => {
  return state.isLoading;
});
