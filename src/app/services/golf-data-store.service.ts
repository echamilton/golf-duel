import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { IUserGolfPicks, IGolferGrouping } from '../models/models';
import { TournamentConfig } from '../models/constants';
import { SportsApiService } from './sports-api.service';

@Injectable({
  providedIn: 'root'
})
export class GolfDataStoreService {
  constructor(
    private fireDb: AngularFireDatabase,
    private sportsApi: SportsApiService
  ) {}

  getGolferGroupings(): Observable<any> {
    const entityName = TournamentConfig.find((data) => data.active).groupName;
    return this.fireDb.list<IGolferGrouping>(entityName).valueChanges();
  }

  updateGroups(list: any) {
    const entityName = TournamentConfig.find((data) => data.active).groupName;
    this.fireDb.list(entityName).remove();
    this.fireDb.list(entityName).push(list);
  }

  getGolferPicks(): Observable<any> {
    return this.fireDb.list<IUserGolfPicks>('myGolfers').valueChanges();
  }

  updateGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .object(
        'myGolfers/' + this.sportsApi.getActiveEventId() + '-' + userPicks.team
      )
      .update(userPicks)
      .then((_) => {});
  }

  saveGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .list('myGolfers')
      .push(
        'myGolfers/' + this.sportsApi.getActiveEventId() + '-' + userPicks.team
      )
      .then((_) => {});
  }

  deleteGolferPicks(userPicks: IUserGolfPicks): void {
    this.fireDb
      .list('myGolfers')
      .remove(this.sportsApi.getActiveEventId() + '-' + userPicks.team)
      .then((_) => {});
  }
}
