import { ITournament } from './models';
import { getMatIconFailedToSanitizeUrlError } from '@angular/material';

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
    active: false,
    groupName: 'wgc2019'
  },
  {
    eventId: 'PLAYERS-2019',
    tournyId: 'Players Championship',
    url: 'https://lbdata.pgatour.com/2019/r/011/leaderboard.json',
    active: false,
    groupName: 'players2019'
  },
  {
    eventId: 'MASTERS-2019',
    tournyId: 'Masters',
    url: 'https://lbdata.pgatour.com/2019/r/014/leaderboard.json',
    active: false,
    groupName: 'masters2019'
  },
  {
    eventId: 'PGACHAMP-2019',
    tournyId: 'Masters',
    url: 'https://lbdata.pgatour.com/2019/r/033/leaderboard.json',
    active: true,
    groupName: 'pgaChamp2019'
  }
];

export const AppTitle = '443 Fantasy Golf';
export const PlayersUrl = 'https://statdata.pgatour.com/players/player.json';
export const PlayersScoresUrl = 'https://lbdata.pgatour.com/2019/r/033/drawer/r';

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

export const AdminEmail = 'evanchamilton@gmail.com';
