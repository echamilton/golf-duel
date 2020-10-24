import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {
  IPlayer,
  ITournamentResults,
  IScoreCard,
  IHole
} from '../models/models';
import {
  TournamentConfig,
  TournamentStatus,
  GolferStatus,
  ScoreValues
} from '../models/constants';
import { map, catchError } from 'rxjs/operators';
import { sortScores } from '../utilities/sorter';

@Injectable({
  providedIn: 'root'
})
export class SportsApiService {
  private tournamentStatus: string;
  private holeParScores: any[];
  constructor(private service: HttpClient) {}

  getGolfScores(): Observable<ITournamentResults> {
    return this.service.get(this.getEventEndpoint()).pipe(
      map(
        (response: any) => {
          return this.buildGolferScores(response);
        },
        catchError((err) => {
          return throwError(
            'Golf Scores API call failed' + '-' + this.getActiveEventId()
          );
        })
      )
    );
  }

  getGolferScoreCard(golferId: string, round: number): Observable<IScoreCard> {
    const golferScoreCardURL = `${this.getScoreCardEndpoint()}${golferId}`;
    return this.service.get(golferScoreCardURL).pipe(
      map((response: any) => {
        return this.buildPlayerScorecard(response, round);
      })
    );
  }

  private buildGolferScores(golferScores: any): ITournamentResults {
    const espnGolfers = golferScores.events[0].competitions[0].competitors;
    const golferResults = [];
    const tournamentResults: ITournamentResults = {};

    //Golfer Scores
    espnGolfers.forEach((espnGolfer) => {
      golferResults.push(this.mapGolferScoreInfo(espnGolfer));
    });

    //Tournament Details
    tournamentResults.round =
      golferScores.events[0].competitions[0].status.period;
    tournamentResults.status = golferScores.events[0].status.type.state;
    tournamentResults.golfers = sortScores(golferResults);
    tournamentResults.eventId = this.getActiveEventId();
    tournamentResults.isTournamentActive = this.isTournamentActive(
      tournamentResults.status
    );

    this.tournamentStatus = tournamentResults.status;
    this.holeParScores = golferScores.events[0].courses[0].holes;

    return tournamentResults;
  }

  private mapGolferScoreInfo(espnGolfer: any): IPlayer {
    const score = this.isGolferActive(espnGolfer.status.displayValue)
      ? this.determineScore(espnGolfer)
      : 99;
    const golfer: IPlayer = {
      golferId: espnGolfer.id,
      name: espnGolfer.athlete.displayName,
      position: espnGolfer.status.position.displayName,
      thru: espnGolfer.status.thru,
      round: espnGolfer.status.period,
      score: score,
      isActive: false,
      status:
        espnGolfer.status.displayValue === GolferStatus.cut
          ? GolferStatus.cut
          : GolferStatus.active,
      imageLink: espnGolfer.athlete.headshot
        ? espnGolfer.athlete.headshot.href
        : espnGolfer.athlete.flag.href
    };
    golfer.isActive = this.isGolferActive(golfer.status);
    return golfer;
  }

  private determineScore(golfer: any): number {
    let score = 0;
    golfer.linescores.forEach((lineScore) => {
      const tempScore =
        lineScore.displayValue == 'E' || lineScore.displayValue == '-'
          ? 0
          : Number(lineScore.displayValue.replace(/\+/gi, ''));
      score = score + tempScore;
    });
    return score;
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

    totalScore.par = inScore.par + outScore.par;
    totalScore.score = inScore.score + outScore.score;
    newScoreCard.In = inScore;
    newScoreCard.Out = outScore;
    newScoreCard.Total = totalScore;

    return newScoreCard;
  }

  getActiveEventId(): any {
    return TournamentConfig.find((data) => data.active).eventId;
  }

  getEventName(): string {
    return TournamentConfig.find((data) => data.active).tournyId;
  }

  getEventEndpoint(): string {
    const tourny = TournamentConfig.find(
      (data) => data.eventId === this.getActiveEventId()
    );
    if (tourny) {
      return tourny.url;
    } else {
      console.error('Could not retrieve PGA Tour data');
    }
  }

  getScoreCardEndpoint(): string {
    const tourny = TournamentConfig.find(
      (data) => data.eventId === this.getActiveEventId()
    );
    if (tourny) {
      return tourny.scorecard;
    } else {
      console.error('Could not retrieve PGA Tour data');
    }
  }

  isTournamentActive(updatedStatus?: string): boolean {
    const status = updatedStatus ? updatedStatus : this.tournamentStatus;
    return status !== TournamentStatus.pre;
  }

  isGolferActive(status): boolean {
    return status !== GolferStatus.cut;
  }
}
