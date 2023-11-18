import { IScoreColor } from './models';

export const INITIALIZED_VALUE = '';

export const ScoreValueColors: IScoreColor[] = [
  { score: 'Birdie', color: 'black' },
  { score: 'Par', color: 'blue' },
  { score: 'Bogey', color: 'red' },
  { score: 'Eagle', color: 'green' },
  { score: 'Double Bogey', color: 'purple' },
  { score: 'NOSCORE', color: 'black' }
];

export enum GolferStatus {
  cut = 'CUT',
  active = 'ACTIVE',
  withdrawn = 'WD'
}

export enum Operation {
  update = 'Update',
  delete = 'Delete'
}

export const LeaderColumns: string[] = [
  'position',
  'team',
  'golfersRemain',
  'holesRemain',
  'score'
];

export enum Messages {
  userCreateSuccess = 'Your account has been created',
  userCreateFail = 'Unable to create account, check username / password',
  userLoginSuccess = 'You have logged in successfully',
  userLoginFail = 'Unable to login with provided credentials',
  submitTeam = 'Are you sure you want to submit your team?',
  deleteTeam = 'Are you sure you want to delete your entry?',
  teamError = 'Complete your entry!',
  teamSuccess = 'Your picks have been updated',
  golferCut = 'Golfer is no longer playing!',
  picksActiveTourny = 'Picks not submitted, tournament already in progress'
}

export enum TournamentStatus {
  pre = 'pre'
}
