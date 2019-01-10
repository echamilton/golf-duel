import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tournament } from './models';
import { map, catchError, tap } from 'rxjs/operators';

// const endpoint = 'https://statdata.pgatour.com/r/014/2018/leaderboard-v2.json';
const endpoint = 'https://statdata.pgatour.com/r/006/2019/leaderboard-v2.json';

@Injectable({
  providedIn: 'root'
})

export class sportsApiService {

  constructor(private service: HttpClient) {

  }
  getGolfScores(): Observable<any> {
    return this.service.get(endpoint).pipe(
      map(this.extractData));
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
