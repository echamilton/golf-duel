import { ITournament } from './models';

export const tournamentConfig: ITournament[] = [
  { eventId: 'DESERT', tournyId: 'Deserts Classic', url: 'https://statdata.pgatour.com/r/002/2019/leaderboard-v2.json', active: '' },
  { eventId: 'MASTERS', tournyId: 'Masters', url: 'https://statdata.pgatour.com/r/014/2018/leaderboard-v2.json', active: '' },
  { eventId: 'FARMERS', tournyId: 'Farmers', url: 'https://statdata.pgatour.com/r/004/2019/leaderboard-v2.json', active: '' },
  { eventId: 'WASTE', tournyId: 'Farmers', url: 'https://statdata.pgatour.com/r/003/2019/leaderboard-v2.json', active: 'X' }
];

export const appTitle = '443 Fantasy Golf';

export enum ScoreValues {
  birdie = 'BIRDIE',
  par = 'PAR',
  eagle = 'EAGLE',
  double = 'DOUBLE',
  triple = 'TRIPLE',
  bogey = 'BOGEY',
}

export enum Messages {
  userCreateSuccess = 'Your account has been created',
  userCreateFail = 'Unable to create account, check username / password',
  userLoginSuccess = 'You have logged in successfully',
  userLoginFail = 'Unable to login with provided credentials',
}

export enum ServiceCodes {
  userFailCode = 'auth/argument-error',
}