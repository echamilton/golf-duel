import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tournament } from './models';
import { _tourny } from './constants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class sportsApiService {
  eventId: string;
  tournaments: Array<tournament> = [];

  constructor(private service: HttpClient) {
    this.tournaments = _tourny;
  }

  getGolfScores(): Observable<any> {
    return this.service.get(this.getEventEndpoint()).pipe(
      map(this.extractData));
  }

  getEventId() {
    this.eventId = 'MASTERS';
    return this.eventId;
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
    return body || {};
  }
}
