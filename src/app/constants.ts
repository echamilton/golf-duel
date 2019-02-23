import { ITournament } from './models';

export const TournamentConfig: ITournament[] = [
  {
    eventId: 'WASTE',
    tournyId: 'Waste Managment',
    url: 'https://statdata.pgatour.com/r/003/2019/leaderboard-v2.json',
    active: false,
    groupName: 'golferGroups'
  },
  {
    eventId: 'WGC-2019',
    tournyId: 'WGC Mexico',
    url: 'https://statdata.pgatour.com/r/473/2019/leaderboard-v2.json',
    active: true,
    groupName: 'wgc2019'
  }
];

export const AppTitle = '443 Fantasy Golf';

export const PlayersUrl = 'https://statdata.pgatour.com/players/player.json';

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
  inProgress = 'In Progress',
  complete = 'Play Complete',
}

export const AdminEmail = 'evanchamilton@gmail.com';
