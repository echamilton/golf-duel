import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { ITournament, IUserGolfPicks, IGolferGrouping } from './models';
import { tournamentConfig } from './constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SportsApiService {
  subscription: Subscription;
  eventId: string;
  tournaments: Array<ITournament> = [];
  cacheData: any;

  constructor(private service: HttpClient, private fireDb: AngularFireDatabase) {
    this.tournaments = tournamentConfig;
  }

  getGolfScores(): Observable<any> {
    return this.service.get(this.getEventEndpoint()).pipe(map(this.extractData));
  }

  getEventId() {
    if (this.eventId == undefined) {
      this.eventId = 'WASTE';
    }
    return this.eventId;
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
    let tourny = this.tournaments.find(data => data.eventId === this.getEventId());
    if (tourny != undefined) {
      return tourny.url;
    } else {
      console.log('Could not retrieve PGA Tour data');
    }
  }

  getGolferGroupings(): Observable<any> {
    return this.fireDb.list<IGolferGrouping>('golferGroups').valueChanges();
  }


  isTournamentActive(status) {
    if (status === 'Official' || status === 'In Progress' || status === 'Play Complete'
    ) {
      return true;
    } else {
      return false;
    }
  }

  isGolferActive(status) {
    if (status == 'active') {
      return true;
    } else {
      return false;
    }
  }

  getGolferPicks(): Observable<any> {
    return this.fireDb.list<IUserGolfPicks>('myGolfers').valueChanges();
  }

  saveGolferPicks(userPicks: IUserGolfPicks) {
    this.fireDb.list('myGolfers').push(userPicks).then(_ => {
    });
  }

  private extractData(res: Response) {
    let body = res;
    body = res;
    return body || [];
  }
}
