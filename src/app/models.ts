export interface userGolfPicks {
    eventId: number,
    team   : string,
    golfer1: string,
    golfer2: string,
    golfer3: string,
    golfer4: string,
    golfer5: string,
    golfer6: string,
    golfer7: string,
    golfer8: string,
  }

  export interface golfers {
    id:   string;
    name: string;
  }

export interface leaderResults {
    position: number;
    team: string;
    score: number;
    golfersRemain: number;
    description: string;
    golfer1: string; 
    golfer2: string;
    golfer3: string;
    golfer4: string;
    golfer5: string;
    golfer6: string;
    golfer7: string;
    golfer8: string;
  }

  export interface indGolferResult {
    golferId: string;
    golferName: string;
    score : number;
    thru: number;
    status: string;
  }