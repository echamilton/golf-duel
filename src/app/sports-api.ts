import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tournament } from './models';
import { _tourny } from './constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SportsApiService {
  eventId: string;
  tournaments: Array<Tournament> = [];
  cacheData: any;
  status: string;

  constructor(private service: HttpClient) {
    this.tournaments = _tourny;
  }

  getGolfScores(): Observable<any> {
    return this.service.get(this.getEventEndpoint()).pipe(
      map(this.extractData));
  }

  getEventId() {
    if (this.eventId == undefined) {
      this.eventId = 'DESERT'
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

  private extractData(res: Response) {
    let body = res;
    return body || [];
  }
}
