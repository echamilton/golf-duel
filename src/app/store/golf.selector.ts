import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IGolfAppState } from './golf.reducer';
import * as cloneDeep from 'lodash/cloneDeep';

const featureSlice = createFeatureSelector<IGolfAppState>('golfData');

export const getGolfTournamentData = createSelector(featureSlice, (state) => {
  return cloneDeep(state.tournamentData);
});

export const getIsTournamentLoading = createSelector(featureSlice, (state) => {
  return state.isLoading;
});
