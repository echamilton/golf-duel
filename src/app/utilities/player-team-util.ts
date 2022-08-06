import { GolferStatus } from '../models/constants';
import { IPlayer, IUserGolfPicks } from '../models/models';

export const isInvalidGolfer = (
  golfPlayersSelections: IUserGolfPicks,
  golferScores: IPlayer[]
) => {
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
};

export const determineHolesRemaining = (currentRound: number) => {
  /**4 rounds, 5 golfers, 18 holes */
  return (5 - (currentRound > 0 ? currentRound : 1)) * (5 * 18);
};
