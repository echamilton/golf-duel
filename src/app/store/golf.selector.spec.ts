import { GOLF_STATE } from '../utilities/test-data';
import * as golfState from './golf.selector';

describe('GolfSelectors', () => {
  it('should select all user picks', () => {
    expect(golfState.getAllUserPicks.projector(GOLF_STATE)).toEqual(
      GOLF_STATE.allUserPicks
    );
  });

  it('should select is loading state', () => {
    expect(golfState.getIsTournamentLoading.projector(GOLF_STATE)).toEqual(
      GOLF_STATE.isLoading
    );
  });

  it('should select is loading groups state', () => {
    expect(golfState.getAreGroupsLoading.projector(GOLF_STATE)).toEqual(
      GOLF_STATE.isLoadingGroups
    );
  });

  it('should select tournament state', () => {
    expect(golfState.getGolfTournamentData.projector(GOLF_STATE)).toEqual(
      GOLF_STATE.tournamentData
    );
  });

  it('should select group state', () => {
    expect(golfState.getGolferGroups.projector(GOLF_STATE)).toEqual(
      GOLF_STATE.golferGroupings
    );
  });

  it('should select is tournament loading state', () => {
    expect(golfState.getIsTournamentLoading.projector(GOLF_STATE)).toEqual(
      GOLF_STATE.isLoading
    );
  });

  it('should select user picks state', () => {
    expect(golfState.getUserPicks.projector(GOLF_STATE)).toEqual(
      GOLF_STATE.userSelectedPicks
    );
  });
});
