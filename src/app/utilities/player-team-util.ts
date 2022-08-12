import { GolferStatus } from '../models/constants';
import {
  ILeaderResults,
  IOwnershipPerGolfer,
  IPlayer,
  ITournamentResults,
  IUserGolfPicks
} from '../models/models';
import { sortScores } from './sorter';

export const buildLeaderboardResults = (
  contestants: IUserGolfPicks[],
  tournamentResults: ITournamentResults,
  ownedPercentages: Array<IOwnershipPerGolfer>
) => {
  const leaderBoardResults: Array<ILeaderResults> = [];

  for (const contestant of contestants) {
    const fantasyLeader: ILeaderResults = {
      position: 0,
      team: contestant.team,
      score: 0,
      holesRemain: determineHolesRemaining(Number(tournamentResults.round)),
      golfersRemain: 0,
      golfers: []
    };

    const contestantPicks: IPlayer[] = buildContestantGolferScores(
      contestant,
      tournamentResults,
      ownedPercentages
    );

    /**This is where we will check number of active golfers are left */
    let i = 0;
    let remain = 0;
    if (tournamentResults.isTournamentActive) {
      fantasyLeader.golfers = [];
      for (const pick of contestantPicks) {
        if (pick.isActive) {
          if (i < 5) {
            i++;
            fantasyLeader.score = +fantasyLeader.score + +pick.score;
            fantasyLeader.holesRemain =
              fantasyLeader.holesRemain - Number(pick.thru);
          }
          remain++;
        } else {
          pick.thru = 'CUT';
        }
        fantasyLeader.golfers.push(pick);
      }
    } else {
      /**Default to 8 active golfers and 99 score when golf tourny not active */
      remain = 8;
      fantasyLeader.score = 99;
    }

    /** if less than 5 golfers then we know that they didnt' make the cut */
    if (remain < 5) {
      fantasyLeader.score = 99;
      fantasyLeader.holesRemain = 0;
    }

    fantasyLeader.golfersRemain = remain;
    leaderBoardResults.push(fantasyLeader);
  }
  if (leaderBoardResults.length > 0) {
    sortScores(leaderBoardResults);
  }

  return leaderBoardResults;
};

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

export const rankEntries = (
  leaderBoardEntries: Array<ILeaderResults>,
  ownPct: Array<IOwnershipPerGolfer>
) => {
  let position = 0;
  let dupPos = 0;
  let prevScore = 999;
  const totalEntries = leaderBoardEntries.length;
  for (const fantasyLeader of leaderBoardEntries) {
    if (fantasyLeader.score === prevScore) {
      fantasyLeader.position = position;
      dupPos++;
    } else {
      position++;
      position = position + dupPos;
      dupPos = 0;
      fantasyLeader.position = position;
    }
    prevScore = fantasyLeader.score;
    /** This will iterate through the golfers and map the value of  */
    for (const golferKey of fantasyLeader.golfers) {
      const golferSelectedCount = ownPct.find(
        (record) => record.golferId === golferKey.golferId
      );
      if (golferSelectedCount) {
        golferKey.ownPct = (golferSelectedCount.count / totalEntries) * 100;
      }
    }
  }
  return leaderBoardEntries;
};

export const updatePercentageOwned = (
  playerPick: IPlayer,
  ownPctArray: IOwnershipPerGolfer[]
) => {
  const ownPct = ownPctArray.find(
    (golfer) => golfer.golferId === playerPick.golferId
  );
  if (ownPct) {
    ownPct.count++;
  } else {
    const ownPctNew: IOwnershipPerGolfer = {
      golferId: playerPick.golferId,
      count: 1
    };
    ownPctArray.push(ownPctNew);
  }
  return ownPctArray;
};

export const buildContestantGolferScores = (
  contestant: IUserGolfPicks,
  tournyResults: ITournamentResults,
  ownedPercentages: Array<IOwnershipPerGolfer>
) => {
  const contestantPicks = [];
  let i = 1;
  while (i <= 8) {
    const golferIndetifier = `golfer${i}`;
    const pgaPlayer = tournyResults.golfers.find(
      (player: IPlayer) =>
        // @ts-ignore
        player.golferId == contestant[golferIndetifier].toString()
    );
    if (pgaPlayer) {
      contestantPicks.push(pgaPlayer);
      updatePercentageOwned(pgaPlayer, ownedPercentages);
    }
    i++;
  }
  sortScores(contestantPicks);
  return contestantPicks;
};
