import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUserGolfPicks, IGolferGrouping, ITournament, IPgaTourData } from './models';
import { TournamentConfig, TournamentStatus, GolferStatus, PlayersUrl, PlayersScoresUrl } from './constants';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SportsApiService {
  eventId: string;
  cacheData: any;
  history: boolean;

  constructor(private service: HttpClient, private fireDb: AngularFireDatabase) {
    this.history = false;
  }

  getGolfScores(): Observable<any> {
    return this.service.get(this.getEventEndpoint()).pipe(
      map(this.extractData),
      catchError(err => {
        return throwError('Golf Scores API call failed' + '-' + this.getEventId());
      }));
  }

  getGolfersPgaTour(): Observable<any> {
    return this.service.get(PlayersUrl).pipe(
      map(this.extractData),
      catchError(err => {
        return throwError('Could not retrieve golfers from PGA Tour');
      })
    );
  }

  getEventId() {
    if (this.eventId == undefined || this.history == false) {
      this.eventId = TournamentConfig.find(data => data.active === true).eventId;
    }
    return this.eventId;
  }

  getActiveEventId() {
    return this.eventId = TournamentConfig.find(data => data.active === true).eventId;
  }

  getEventName() {
    return TournamentConfig.find(data => data.active === true).tournyId;
  }

  setEventId(setEventId, history) {
    this.eventId = setEventId;
    this.history = history;
  }

  setApiData(data) {
    this.cacheData = data;
  }

  getApiData() {
    return this.cacheData;
  }

  getPlayerScoreCard(golferId: string, roundId: string): Observable<any> {
    let url: string;
    url = PlayersScoresUrl + roundId + '-m' + golferId + '.json';
    return this.service.get(url).pipe(
      map(this.extractData),
      catchError(err => {
        return throwError('Golf Scores API call failed' + '-' + this.getEventId());
      }));
  }

  getEventEndpoint() {
    let tourny = TournamentConfig.find(data => data.eventId === this.getEventId());
    if (tourny !== undefined) {
      return tourny.url;
    } else {
      console.log('Could not retrieve PGA Tour data');
    }
  }

  getGolferGroupings(): Observable<any> {
    let entityName = TournamentConfig.find(data => data.active === true).groupName;
    return this.fireDb.list<IGolferGrouping>(entityName).valueChanges();
  }

  updateGroups(list: any) {
    let entityName = TournamentConfig.find(data => data.active === true).groupName;
    this.fireDb.list(entityName).remove();
    this.fireDb.list(entityName).push(list);
  }

  isTournamentActive(status) {
    if (status === TournamentStatus.offical || status === TournamentStatus.inProgress ||
      status === TournamentStatus.complete || status === TournamentStatus.suspended
    ) {
      return true;
    } else {
      return false;
    }
  }

  isGolferActive(status) {
    return status == GolferStatus.active ? true : false;
  }

  getGolferPicks(): Observable<any> {
    return this.fireDb.list<IUserGolfPicks>('myGolfers').valueChanges();
  }

  updateGolferPicks(userPicks: IUserGolfPicks) {
    this.fireDb.object('myGolfers/' + this.getEventId() + '-' + userPicks.team).update(userPicks).then(_ => {
    });
  }

  saveGolferPicks(userPicks: IUserGolfPicks) {
    this.fireDb.list('myGolfers').push('myGolfers/' + this.getEventId() + '-' + userPicks.team).then(_ => {
    });
  }

  deleteGolferPicks(userPicks: IUserGolfPicks) {
    this.fireDb.list('myGolfers').remove(this.getEventId() + '-' + userPicks.team).then(_ => {
    });
  }

  getHistoryEvents() {
    let tournaments: Array<ITournament> = [];

    for (let key in TournamentConfig) {
      if (TournamentConfig[key].active != true) {
        tournaments.push(TournamentConfig[key]);
      }
    }
    return tournaments;
  }

  private extractData(res: Response) {
    let body = res;
    return body || [];
  }
}
