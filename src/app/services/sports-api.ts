import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { IUserGolfPicks, IGolferGrouping, IPlayer, IResults} from './../models/models';
import { TournamentConfig, TournamentStatus, GolferStatus } from './../models/constants';
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
      const data: any = response;
      const espnGolfers = data.events[0].competitions[0].competitors;
      const myGolfers = [];
      const tournamentResults: IResults = {};
      espnGolfers.forEach(espnGolfer => {
        const score = this.determineScore(espnGolfer);
        const golfer: IPlayer = {
        golferId: espnGolfer.id,
        name: espnGolfer.athlete.displayName,
        position: espnGolfer.status.position.displayName,
        thru: espnGolfer.status.thru,
        score: score,
        status: espnGolfer.status.displayValue,
        imageLink: espnGolfer.athlete.headshot ? espnGolfer.athlete.headshot.href : espnGolfer.athlete.flag.href,
        };
        myGolfers.push(golfer);
      });
      tournamentResults.round = data.events[0].competitions[0].status.period;
      tournamentResults.status = data.events[0].status.type.state;
      tournamentResults.golfers = this.getSortedData(myGolfers);
      return tournamentResults;
    },
      catchError(err => {
        return throwError('Golf Scores API call failed' + '-' + this.getEventId());
      })));
  }

  private determineScore(golfer):number {
    let score = 0;
    golfer.linescores.forEach(lineScore=> {
      const tempScore = lineScore.displayValue == 'E' || lineScore.displayValue == '-'  ? 0 : Number(lineScore.displayValue.replace(/\+/gi, ""));
      score = score + tempScore;
    });
    return score;
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

  getEventName(){
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
      console.error('Could not retrieve PGA Tour data');
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
    return status !== TournamentStatus.pre;
  }

  isGolferActive(status) {
    return status !== GolferStatus.cut;
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
}
