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
  GolferStatus
} from '../models/constants';
import { map, catchError } from 'rxjs/operators';
import { sortScores } from '../utilities/sorter';

@Injectable({
  providedIn: 'root'
})
export class SportsApiService {
  cacheData: any;

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
    const myGolfers = [];
    const tournamentResults: ITournamentResults = {};
    espnGolfers.forEach((espnGolfer) => {
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
        status:
          espnGolfer.status.displayValue === GolferStatus.cut
            ? GolferStatus.cut
            : GolferStatus.active,
        imageLink: espnGolfer.athlete.headshot
          ? espnGolfer.athlete.headshot.href
          : espnGolfer.athlete.flag.href
      };
      myGolfers.push(golfer);
    });
    tournamentResults.round =
      golferScores.events[0].competitions[0].status.period;
    tournamentResults.status = golferScores.events[0].status.type.state;
    tournamentResults.golfers = sortScores(myGolfers);
    return tournamentResults;
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
    newScoreCard.playerName = playerScorecard.profile.displayName;
    newScoreCard.imageLink = playerScorecard.profile.headshot;
    //Map holes
    let holeIndex = 1;
    holeScores.forEach((hole) => {
      const holeScores: IHole = {
        score: hole.value,
        par: hole.par,
        indicator: hole.scoreType.displayName
      };
      newScoreCard[`hole${holeIndex}`] = holeScores;
      newScoreCard.In = holeScores;
      newScoreCard.Out = holeScores;
      newScoreCard.Total = holeScores;
      holeIndex++;
    });

    return newScoreCard;
  }

  getActiveEventId(): any {
    return TournamentConfig.find((data) => data.active).eventId;
  }

  getEventName(): string {
    return TournamentConfig.find((data) => data.active).tournyId;
  }

  setApiData(data): void {
    this.cacheData = data;
  }

  getApiData() {
    return this.cacheData;
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

  isTournamentActive(status): boolean {
    return status !== TournamentStatus.pre;
  }

  isGolferActive(status): boolean {
    return status !== GolferStatus.cut;
  }
}
