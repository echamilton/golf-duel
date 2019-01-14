export interface UserGolfPicks {
  eventId: string;
  team: string;
  golfer1: string;
  golfer2: string;
  golfer3: string;
  golfer4: string;
  golfer5: string;
  golfer6: string;
  golfer7: string;
  golfer8: string;
}

export interface GolferGrouping {
  eventId: string;
  group: string;
  golferId: string;
  name: string;
}

export interface Golfers {
  id: string;
  name: string;
}

export interface ScrollBar {
  name: string;
  score: string;
  position: string;
  hole: string;
}

export interface Tournament {
  eventId: string;
  tournyId: string;
  url: string;
  active: string;
}

export interface GolferItem {
  name: string;
  id: string;
  thru: string;
  score: number;
  ownPct: number;
  color: string;
  round: string;
}

export interface LeaderResults {
  position: number;
  team: string;
  score: number;
  golfersRemain: number;
  description: string;
  golfers: Array<GolferItem>;
}

export interface GolferDetail {
  golferId: string;
  count: number;
  detail: string;
  pct: number;
}

export interface IndGolferResult {
  golferId: string;
  golferName: string;
  score: number;
  thru: number;
  status: string;
  round: string;
}

export interface ScoreCard {
  hole1: string;
  hole2: string;
  hole3: string;
  hole4: string;
  hole5: string;
  hole6: string;
  hole7: string;
  hole8: string;
  hole9: string;
  hole10: string;
  hole11: string;
  hole12: string;
  hole13: string;
  hole14: string;
  hole15: string;
  hole16: string;
  hole17: string;
  hole18: string;
  par1: string;
  par2: string;
  par3: string;
  par4: string;
  par5: string;
  par6: string;
  par7: string;
  par8: string;
  par9: string;
  par10: string;
  par11: string;
  par12: string;
  par13: string;
  par14: string;
  par15: string;
  par16: string;
  par17: string;
  par18: string;
  parIn: string;
  parOut: string;
  holeIn: string;
  holeOut: string;
  parTot: string;
  holeTot: string;
  playerName: string;
}