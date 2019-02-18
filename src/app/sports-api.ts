import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUserGolfPicks, IGolferGrouping, ITournament } from './models';
import { TournamentConfig, TournamentStatus, GolferStatus } from './constants';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class SportsApiService {
  eventId: string;
  cacheData: any;

  constructor(private service: HttpClient, private fireDb: AngularFireDatabase) {
  }

  getGolfScores(): Observable<any> {
    return this.service.get(this.getEventEndpoint()).pipe(
      map(this.extractData),
      catchError(err => {
        return throwError("Golf Scores API call failed");
      }));
  }

  getEventId() {
    if (this.eventId == undefined) {
      this.eventId = TournamentConfig.find(data => data.active === true).eventId;
    }
    return this.eventId;
  }

  getEventName() {
    return TournamentConfig.find(data => data.active === true).tournyId;
  }

  setEventId(setEventId) {
    this.eventId = setEventId;
  }

  setApiData(data) {
    this.cacheData = data;
  }

  getApiData() {
    return this.cacheData;
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
    return this.fireDb.list<IGolferGrouping>('golferGroups').valueChanges();
  }


  isTournamentActive(status) {
    if (status === TournamentStatus.offical || status === TournamentStatus.inProgress || status === TournamentStatus.complete
    ) {
      return true;
    } else {
      return false;
    }
  }

  isGolferActive(status) {
    if (status == GolferStatus.active) {
      return true;
    } else {
      return false;
    }
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
    body = res;
    return body || [];
  }
}
