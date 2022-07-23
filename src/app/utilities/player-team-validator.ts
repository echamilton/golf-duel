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

  //CHeck if the golfer is missing from the list - this should be in pick team
  return isInvalid;
}

function getGolferKeyValue(playerPicksObject: IUserGolfPicks): string[] {
  const playerPicksArray: string[] = [];
  // const test: IUserGolfPicks = { ...playerPicksObject };

  const test: IUserGolfPicks = { ...playerPicksObject, golfer1: '569' };
  console.log(test);
  for (let key in test) {
    if (key.includes('golfer')) {
      playerPicksArray.push(test[key as keyof IUserGolfPicks]);
    }
  }
  return playerPicksArray;
}
