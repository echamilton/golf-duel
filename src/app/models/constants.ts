import { ITournament, IScoreColor } from './models';

export const TournamentConfig: ITournament[] = [
  {
    eventId: 'PLAYERS-2022',
    tournyId: 'PLAYERS-2022',
    url: 'https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?event=401353254',
    active: true,
    groupName: 'players2022',
    scorecard:
      'https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard/401353254/playersummary?region=us&lang=en&season=2020&player='
  },
  {
    eventId: 'THEOPEN-2021',
    tournyId: 'THEOPEN-2021',
    url: 'https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?event=401243410',
    active: false,
    groupName: 'theOpen2021',
    scorecard:
      'https://site.web.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard/401243410/playersummary?region=us&lang=en&season=2020&player='
  }
];

export const AppTitle = '443 Fantasy Golf';

export const INITIALIZED_VALUE = '';

export enum ScoreValues {
  birdie = 'Birdie',
  par = 'Par',
  eagle = 'Eagle',
  double = 'Double Bogey',
  triple = 'Triple Bogey',
  bogey = 'Bogey',
  noScore = 'NOSCORE'
}

export const ScoreValueColors: IScoreColor[] = [
  { score: ScoreValues.par, color: 'black' },
  { score: ScoreValues.birdie, color: 'blue' },
  { score: ScoreValues.bogey, color: 'red' },
  { score: ScoreValues.eagle, color: 'green' },
  { score: ScoreValues.double, color: 'purple' },
  { score: ScoreValues.noScore, color: 'black' }
];

export enum GolferStatus {
  cut = 'CUT',
  active = 'ACTIVE',
  withdrawn = 'WD'
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
  teamSuccess = 'Picks have been submitted!',
  deleteSuccess = 'Picks have been removed!',
  golferCut = 'Golfer has been cut!',
  picksActiveTourny = 'Picks not submitted, tournament already in progress'
}

export enum ServiceCodes {
  userFailCode = 'auth/argument-error'
}

export enum TournamentStatus {
  pre = 'pre'
}
