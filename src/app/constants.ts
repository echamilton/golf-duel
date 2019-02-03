import { ITournament } from './models';

export const tournamentConfig: ITournament[] = [
  { eventId: 'DESERT', tournyId: 'Deserts Classic', url: 'https://statdata.pgatour.com/r/002/2019/leaderboard-v2.json', active: '' },
  { eventId: 'MASTERS', tournyId: 'Masters', url: 'https://statdata.pgatour.com/r/014/2018/leaderboard-v2.json', active: '' },
  { eventId: 'FARMERS', tournyId: 'Farmers', url: 'https://statdata.pgatour.com/r/004/2019/leaderboard-v2.json', active: '' },
  { eventId: 'WASTE', tournyId: 'Farmers', url: 'https://statdata.pgatour.com/r/003/2019/leaderboard-v2.json', active: 'X' }
];

export const appTitle = '443 Fantasy Golf';