import { ITournament } from './models';

export const TournamentConfig: ITournament[] = [
  {
    eventId: 'USOPEN-2019',
    tournyId: 'US Open',
    url: 'https://lbdata.pgatour.com/2019/r/026/leaderboard.json',
    active: false,
    groupName: 'usOpen2019'
  },
  {
   eventId: 'PGACHAMP-2020',
   tournyId: 'WGC Jude',
   url: 'https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?event=401155467',
   active: true,
   groupName: 'pgaChamp2020',
  },
  {
   eventId: 'PGACHAMP-2020',
   tournyId: 'PGA Championship',
   url: 'https://site.web.api.espn.com/apis/site/v2/sports/golf/leaderboard?event=401219481',
   active: false,
   groupName: 'pgaChamp2020',
  }
];

export const AppTitle = '443 Fantasy Golf';

export enum ScoreValues {
  birdie = 'BIRDIE',
  par = 'PAR',
  eagle = 'EAGLE',
  double = 'DOUBLE',
  triple = 'TRIPLE',
  bogey = 'BOGEY',
  noScore = 'NOSCORE',
}

export enum GolferStatus {
  cut = 'CUT',
  active = 'active',
}

export const LeaderColumns: string[] = [
  'position',
  'team',
  'golfersRemain',
  'holesRemain',
  'score'];

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
  picksActiveTourny = 'Picks not submitted, tournament already in progress',
}

export enum ServiceCodes {
  userFailCode = 'auth/argument-error',
}

export enum TournamentStatus {
  offical = 'Official',
  suspended = 'Suspended',
  inProgress = 'In Progress',
  complete = 'Play Complete',
}
