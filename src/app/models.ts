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

export interface Hole {
  score: string;
  par: string;
  indicator: string;
}

export interface ScoreCard {
  playerName: string;
  hole1: Hole;
  hole2: Hole;
  hole3: Hole;
  hole4: Hole;
  hole5: Hole;
  hole6: Hole;
  hole7: Hole;
  hole8: Hole;
  hole9: Hole;
  hole10: Hole;
  hole11: Hole;
  hole12: Hole;
  hole13: Hole;
  hole14: Hole;
  hole15: Hole;
  hole16: Hole;
  hole17: Hole;
  hole18: Hole;
  In: Hole;
  Out: Hole;
  Total: Hole;
}