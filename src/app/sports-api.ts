import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITournament } from './models';
import { tournamentConfig } from './constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SportsApiService {
  eventId: string;
  tournaments: Array<ITournament> = [];
  cacheData: any;
  status: string;

  constructor(private service: HttpClient) {
    this.tournaments = tournamentConfig;
  }

  getGolfScores(): Observable<any> {
    return this.service.get(this.getEventEndpoint()).pipe(
      map(this.extractData));
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

  isTournamentActive(status) {
    if (status === 'Official' || status === 'In Progress' ||
      status === 'Play Complete'
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

  private extractData(res: Response) {
    let body = res;
    let responseData: any;
    responseData = res;
    body = responseData;
    return body || [];
  }
}
