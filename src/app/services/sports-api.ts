import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { IUserGolfPicks, IGolferGrouping, ITournament, IGolfers , IPlayer} from '../models';
import { TournamentConfig, TournamentStatus, GolferStatus, PlayersUrl, PlayersScoresUrl } from '../constants';
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
      map((response:any) => {
      const espnGolfers = this.extractData(response);
      const myGolfers = [];

      espnGolfers.forEach(espnGolfer => {
        let golfer: IPlayer = {};
        golfer.golferId = espnGolfer.id;
        golfer.name = espnGolfer.athlete.displayName;
        golfer.position = espnGolfer.status.position.displayName;
        golfer.thru = espnGolfer.status.thru;
        const score = Number( espnGolfer.score.displayValue === 'E' ? 0 : espnGolfer.score.displayValue.replace(/\+/gi, ""));
        golfer.score = score;
        myGolfers.push(golfer);
      });
      
      return this.getSortedData(myGolfers);
    },
      catchError(err => {
        return throwError('Golf Scores API call failed' + '-' + this.getEventId());
      })));
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

  // getPlayerScoreCard(golferId: string, roundId: string): Observable<any> {
  //   let url: string;
  //   url = PlayersScoresUrl + roundId + '-m' + golferId + '.json';
  //   return this.service.get(url).pipe(
  //     map(this.extractData),
  //     catchError(err => {
  //       return throwError('Golf Scores API call failed' + '-' + this.getEventId());
  //     }));
  // }


  getSortedData(data) {
    return data.sort((a, b) => {
      switch ('score') {
        case 'score': return compare(+a.score, +b.score, true);
        default: return 0;
      }
      function compare(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
      }
    });
  }
  getEventEndpoint() {
    const tourny = TournamentConfig.find(data => data.eventId === this.getEventId());
    if (tourny) {
      return tourny.url;
    } else {
      console.log('Could not retrieve PGA Tour data');
    }
  }

  getGolferGroupings(): Observable<any> {
    const entityName = TournamentConfig.find(data => data.active === true).groupName;
    return this.fireDb.list<IGolferGrouping>(entityName).valueChanges();
  }

  updateGroups(list: any) {
    const entityName = TournamentConfig.find(data => data.active === true).groupName;
    this.fireDb.list(entityName).remove();
    this.fireDb.list(entityName).push(list);
  }

  isTournamentActive(status): boolean {
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

  getLeaderBoardResults():Observable<IGolfers[]> {
   return this.service.get(this.getEventEndpoint()).pipe(
        map((response: any)=> {
          const tournament = this.extractData(response);
          const golfers = tournament.events[0].competitions.competitors;
          console.log(golfers);
         return null; }
        ),
        catchError(err => {
          return throwError('Golf Scores API call failed' + '-' + this.getEventId());
        }));
  }

  private extractData(res: Response):any {
    const data: any = res;
    const golfers = data.events[0].competitions[0].competitors;
    return golfers || [];
  }
}
