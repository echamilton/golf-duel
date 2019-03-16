export interface IUserGolfPicks {
  eventId: string;
  team: string;
  email: string;
  golfer1: string;
  golfer2: string;
  golfer3: string;
  golfer4: string;
  golfer5: string;
  golfer6: string;
  golfer7: string;
  golfer8: string;
}

export interface IGolferGrouping {
  eventId: string;
  group: string;
  golferId: string;
  name: string;
}

export interface IGolfers {
  id: string;
  name: string;
}

export interface IScrollBar {
  name: string;
  score: string;
  scoreToday: string;
  position: string;
  hole: string;
  golferId: string;
}

export interface ITournament {
  eventId: string;
  tournyId: string;
  url: string;
  active: boolean;
  groupName: string;
}

export interface IGolferItem {
  name: string;
  id: string;
  thru: string;
  score: number;
  ownPct: number;
  round: string;
  status: string;
}

export interface ILeaderResults {
  position: number;
  team: string;
  score: number;
  holesRemain: number;
  golfersRemain: number;
  description: string;
  golfers: Array<IGolferItem>;
}

export interface IGolferDetail {
  golferId: string;
  count: number;
  detail: string;
  pct: number;
}

export interface IMsgHandle {
  success: boolean;
  message: string;
}

export interface IIndGolferResult {
  golferId: string;
  golferName: string;
  score: number;
  thru: number;
  status: string;
  round: string;
}

export interface IHole {
  score: string;
  par: string;
  indicator: string;
}

export interface IScoreCard {
  playerName: string;
  hole1: IHole;
  hole2: IHole;
  hole3: IHole;
  hole4: IHole;
  hole5: IHole;
  hole6: IHole;
  hole7: IHole;
  hole8: IHole;
  hole9: IHole;
  hole10: IHole;
  hole11: IHole;
  hole12: IHole;
  hole13: IHole;
  hole14: IHole;
  hole15: IHole;
  hole16: IHole;
  hole17: IHole;
  hole18: IHole;
  In: IHole;
  Out: IHole;
  Total: IHole;
}

export interface IPgaTourData{
  status: string;
}