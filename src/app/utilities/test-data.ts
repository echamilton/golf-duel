import { IPlayer } from '../models/models';
import { IGolfAppState } from '../store/golf.reducer';

export const GOLFER_ACTIVE: IPlayer = {
  name: 'Tiger Woods',
  score: -5,
  position: '1',
  golferId: '1234',
  scoreToday: '33',
  round: '2',
  ownPct: 33,
  hole: '9',
  status: 'active',
  imageLink: 'www.image.com',
  isActive: true,
  thru: '9'
};

export const GOLFER_INACTIVE: IPlayer = {
  name: 'Tiger Woods',
  score: -5,
  position: '1',
  golferId: '1234',
  scoreToday: '33',
  round: '2',
  ownPct: 33,
  hole: '9',
  status: 'active',
  imageLink: 'www.image.com',
  isActive: false,
  thru: '9'
};

export const GOLF_STATE: IGolfAppState = {
  isLoadingGroups: true,
  isLoading: true,
  isUserPicksUpdating: true
};
