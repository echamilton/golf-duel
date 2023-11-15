import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITournamentResults, IScoreCard } from '../models/models';
import { TournamentConfig, TournamentStatus } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class SportsApiService {
  constructor(private service: HttpClient) {}

  getTournamentLeaderboard(): Observable<ITournamentResults> {
    return this.service.get(TournamentConfig.url).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getGolferScoreCard(golferId: string, round: number): Observable<IScoreCard> {
    return this.service
      .get(`${TournamentConfig.scorecard}${golferId}?round=${round}`)
      .pipe(
        map((response: IScoreCard) => {
          return response;
        })
      );
  }

  // isTournamentActive(updatedStatus?: string): boolean {
  //   return updatedStatus !== TournamentStatus.pre;
  // }
}
