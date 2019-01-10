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

  export interface scrollBar {
    name: string;
    score: string;
    position: string;
    hole:string;
  }

export interface tournament {
  tournyId: string;
  url: string;
}

export interface leaderResultsOLD {
    position: number;
    team: string;
    score: number;
    golfersRemain: number;
    description: string;
    golfer1: string;
    id1: string;
    golfer2: string;
    id2: string;
    golfer3: string;
    id3: string;
    golfer4: string;
    id4: string;
    golfer5: string;
    id5: string;
    golfer6: string;
    id6: string;
    golfer7: string;
    id7: string;
    golfer8: string;
    id8: string;
  }
  export interface golferItem {
    name: string;
    id  : string;
    thru: string;
    score: number;
  }

  export interface leaderResults {
    position: number;
    team: string;
    score: number;
    golfersRemain: number;
    description: string;
    golfers: Array<golferItem>;
  }

  export interface golferDetail{
    golferId: string;
    detail: string;
  }

  export interface indGolferResult {
    golferId: string;
    golferName: string;
    score : number;
    thru: number;
    status: string;
  }

  export interface scoreCard {
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
    par1:  string;
    par2:  string;
    par3:  string;
    par4:  string;
    par5:  string;
    par6:  string;
    par7:  string;
    par8:  string;
    par9:  string;
    par10:  string;
    par11:  string;
    par12:  string;
    par13:  string;
    par14:  string;
    par15:  string;
    par16:  string;
    par17:  string;
    par18:  string;
    parIn: string;
    parOut: string;
    holeIn: string;
    holeOut: string;
    parTot: string;
    holeTot: string;
    playerName: string;
  }