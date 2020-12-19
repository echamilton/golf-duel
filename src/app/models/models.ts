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

export interface IGolfersGroupPick {
  id: string;
  name: string;
}

export interface ITournamentResults {
  eventId?: string;
  round?: string;
  status?: string;
  isTournamentActive?: boolean;
  golfers?: IPlayer[];
}

export interface IGolferGroupingsUI {
  groupA?: IGolfersGroupPick[];
  groupB?: IGolfersGroupPick[];
  groupC?: IGolfersGroupPick[];
}

export interface IPlayer {
  name?: string;
  score?: number;
  scoreToday?: string;
  position?: string;
  hole?: string;
  golferId?: string;
  ownPct?: number;
  round?: string;
  status?: string;
  isActive?: boolean;
  thru?: string;
  imageLink?: string;
}

export interface ITournament {
  eventId: string;
  tournyId: string;
  url: string;
  groupName: string;
  scorecard?: string;
}

export interface ILeaderResults {
  position: number;
  team: string;
  score: number;
  holesRemain: number;
  golfersRemain: number;
  golfers: Array<IPlayer>;
}

export interface IOwnershipPerGolfer {
  golferId: string;
  count: number;
}

export interface IMsgHandle {
  success: boolean;
  message: string;
}

export interface IHole {
  score?: number;
  par?: number;
  indicator?: string;
}

export interface IScoreCard {
  playerName?: string;
  imageLink?: string;
  hole1?: IHole;
  hole2?: IHole;
  hole3?: IHole;
  hole4?: IHole;
  hole5?: IHole;
  hole6?: IHole;
  hole7?: IHole;
  hole8?: IHole;
  hole9?: IHole;
  hole10?: IHole;
  hole11?: IHole;
  hole12?: IHole;
  hole13?: IHole;
  hole14?: IHole;
  hole15?: IHole;
  hole16?: IHole;
  hole17?: IHole;
  hole18?: IHole;
  In?: IHole;
  Out?: IHole;
  Total?: IHole;
}

export interface IScoreColor {
  score: string;
  color: string;
}
