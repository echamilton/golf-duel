import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITournamentResults, IScoreCard, IHole } from '../models/models';
import {
  TournamentConfig,
  TournamentStatus,
  ScoreValues
} from '../models/constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SportsApiService {
  private tournamentStatus: string;
  private holeParScores: any[];
  constructor(private service: HttpClient) {}

  getGolfScores(): Observable<ITournamentResults> {
    return this.service.get(TournamentConfig.url);
  }

  getGolferScoreCard(golferId: string, round: number): Observable<IScoreCard> {
    const golferScoreCardURL = `${TournamentConfig.scorecard}${golferId}`;
    return this.service.get(golferScoreCardURL).pipe(
      map((response: any) => {
        return this.buildPlayerScorecard(response, round);
      })
    );
  }

  private buildPlayerScorecard(
    playerScorecard: any,
    round: number
  ): IScoreCard {
    const holeScores = playerScorecard.rounds[round - 1].linescores;
    const newScoreCard: IScoreCard = {};
    const inScore: IHole = { par: 0, score: 0 };
    const outScore: IHole = { par: 0, score: 0 };
    const totalScore: IHole = { par: 0, score: 0 };

    newScoreCard.playerName = playerScorecard.profile.displayName;
    newScoreCard.imageLink = playerScorecard.profile.headshot;

    //Iterate through each Hole
    this.holeParScores.forEach((parScore) => {
      const holeScore = holeScores.find(
        (hole) => hole.period === parScore.number
      );
      const currentHole: IHole = {
        par: parScore.shotsToPar,
        score: 0,
        indicator: ScoreValues.par
      };

      if (holeScore) {
        currentHole.indicator = holeScore.scoreType.displayName;
        currentHole.score = holeScore.value;
      }
      newScoreCard[`hole${parScore.number}`] = currentHole;

      if (parScore.number > 9) {
        inScore.par = inScore.par + parScore.shotsToPar;
        inScore.score = playerScorecard.rounds[round - 1].inScore;
      } else {
        outScore.par = outScore.par + parScore.shotsToPar;
        outScore.score = playerScorecard.rounds[round - 1].outScore;
      }
    });
    outScore.score = outScore.score ? outScore.score : 0;
    inScore.score = inScore.score ? inScore.score : 0;
    totalScore.par = inScore.par + outScore.par;
    totalScore.score = inScore.score + outScore.score;
    newScoreCard.In = inScore;
    newScoreCard.Out = outScore;
    newScoreCard.Total = totalScore;

    return newScoreCard;
  }

  isTournamentActive(updatedStatus?: string): boolean {
    const status = updatedStatus ? updatedStatus : this.tournamentStatus;
    return status !== TournamentStatus.pre;
  }

  getEventId(): string {
    return TournamentConfig.eventId;
  }
}
