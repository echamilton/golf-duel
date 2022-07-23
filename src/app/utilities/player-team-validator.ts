import { GolferStatus } from '../models/constants';
import { IPlayer, IUserGolfPicks } from '../models/models';

export function isInvalidGolfer(
  golfPlayersSelections: IUserGolfPicks,
  golferScores: IPlayer[]
): boolean {
  const golferPicksArray = getGolferKeyValue(golfPlayersSelections);
  let isInvalid: boolean = false;
  //Check for 8 golfers
  if (golferPicksArray.length !== 8) {
    return true;
  }

  //Iterate through each selection to see if there are present in list
  golferPicksArray.forEach((picks: string) => {
    const playerRecord = golferScores.find(
      (golfer) => golfer.golferId == picks
    );
    if (playerRecord?.status == GolferStatus.withdrawn) {
      isInvalid = true;
    }
  });
  return isInvalid;
}

function getGolferKeyValue(playerPicksObject: IUserGolfPicks): string[] {
  const playerPicksArray: string[] = [];
  for (let key in playerPicksObject) {
    if (key.includes('golfer')) {
      playerPicksArray.push(playerPicksObject[key as keyof IUserGolfPicks]);
    }
  }
  return playerPicksArray;
}
