import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import {
  IUserGolfPicks,
  IGolferGrouping,
  IPlayer,
  ITournamentResults
} from './../models/models';
import {
  TournamentConfig,
  TournamentStatus,
  GolferStatus
} from './../models/constants';
import { map, catchError } from 'rxjs/operators';
import { sortScores } from './../utilities/sorter';

@Injectable({
  providedIn: 'root'
})
export class SportsApiService {
  cacheData: any;

  constructor(
    private service: HttpClient,
    private fireDb: AngularFireDatabase
  ) {}

  getGolfScores(): Observable<ITournamentResults> {
    return this.service.get(this.getEventEndpoint()).pipe(
      map(
        (response: any) => {
          const data: any = response;
          const espnGolfers = data.events[0].competitions[0].competitors;
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
            data.events[0].competitions[0].status.period;
          tournamentResults.status = data.events[0].status.type.state;
          tournamentResults.golfers = sortScores(myGolfers);
          return tournamentResults;
        },
        catchError((err) => {
          return throwError(
            'Golf Scores API call failed' + '-' + this.getActiveEventId()
          );
        })
      )
    );
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

  getGolferGroupings(): Observable<any> {
    const entityName = TournamentConfig.find((data) => data.active === true)
      .groupName;
    return this.fireDb.list<IGolferGrouping>(entityName).valueChanges();
  }

  updateGroups(list: any) {
    const entityName = TournamentConfig.find((data) => data.active === true)
      .groupName;
    this.fireDb.list(entityName).remove();
    this.fireDb.list(entityName).push(list);
  }

  isTournamentActive(status): boolean {
    return status !== TournamentStatus.pre;
  }

  isGolferActive(status): boolean {
    return status !== GolferStatus.cut;
  }

  getGolferPicks(): Observable<any> {
    return this.fireDb.list<IUserGolfPicks>('myGolfers').valueChanges();
  }

  updateGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .object('myGolfers/' + this.getActiveEventId() + '-' + userPicks.team)
      .update(userPicks)
      .then((_) => {});
  }

  saveGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .list('myGolfers')
      .push('myGolfers/' + this.getActiveEventId() + '-' + userPicks.team)
      .then((_) => {});
  }

  deleteGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .list('myGolfers')
      .remove(this.getActiveEventId() + '-' + userPicks.team)
      .then((_) => {});
  }
}
