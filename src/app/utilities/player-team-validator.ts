import { GolferStatus } from '../models/constants';
import { IPlayer, IUserGolfPicks } from '../models/models';

export function isInvalidGolfer(
  golfPlayersSelections: IUserGolfPicks,
  golferScores: IPlayer[]
): boolean {
  let isInvalid: boolean = false;
  const golferPicksArray = Object.values(golfPlayersSelections);

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
