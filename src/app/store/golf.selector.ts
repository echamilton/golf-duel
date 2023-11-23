import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IGolfAppState } from './golf.reducer';

const featureSlice = createFeatureSelector<IGolfAppState>('golfData');

export const getGolfTournamentData = createSelector(featureSlice, (state) => {
  return state.tournamentData!;
});

export const getGolferGroups = createSelector(featureSlice, (state) => {
  return state.golferGroupings!;
});

export const getUserPicks = createSelector(featureSlice, (state) => {
  return state.userSelectedPicks!;
});

export const getAllUserPicks = createSelector(featureSlice, (state) => {
  return state.allUserPicks!;
});

export const getIsTournamentLoading = createSelector(featureSlice, (state) => {
  return state.isLoading;
});

export const getAreGroupsLoading = createSelector(featureSlice, (state) => {
  return state.isLoadingGroups;
});

export const getGolferScorecardData = createSelector(featureSlice, (state) => {
  return state.golferScorecard;
});

export const getTournamentActive = createSelector(featureSlice, (state) => {
  return state.tournamentData?.isTournamentActive;
});

export const isScorecardLoading = createSelector(featureSlice, (state) => {
  return state.isScorecardLoading;
});
