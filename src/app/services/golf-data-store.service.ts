import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { IUserGolfPicks, IGolferGrouping } from '../models/models';
import { INITIALIZED_VALUE, TournamentConfig } from '../models/constants';
import { SportsApiService } from './sports-api.service';
import { AuthService } from './auth.service';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GolfDataStoreService {
  constructor(
    private fireDb: AngularFireDatabase,
    private firestore: Firestore,
    private sportsApi: SportsApiService,
    private authService: AuthService
  ) {
    const collection33 = collection(this.firestore, 'myGolfers');
    const data = collectionData(collection33);
    data.subscribe((x) => console.log(x));
    // this.item$ = collectionData(collection);
  }

  getGolferGroupings(): Observable<IGolferGrouping[]> {
    const entityName = TournamentConfig.find((data) => data.active)!.groupName;
    return this.fireDb
      .list<IGolferGrouping>(entityName)
      .valueChanges()
      .pipe(
        map((groupings: any) => {
          const tournamentGroups: IGolferGrouping[] = groupings[0];
          return tournamentGroups;
        })
      );
  }

  getGolferPicks(): Observable<IUserGolfPicks[]> {
    return this.fireDb
      .list<IUserGolfPicks>('myGolfers')
      .valueChanges()
      .pipe(
        map((contestants: IUserGolfPicks[]) => {
          const filteredContestants = contestants.filter(
            (record) => record.eventId === this.sportsApi.getActiveEventId()
          );
          return filteredContestants;
        })
      );
  }

  loadUserPicks(): Observable<IUserGolfPicks> {
    return this.getGolferPicks().pipe(
      map((allUserPicks: IUserGolfPicks[]) => {
        return this.filterUserPicks(allUserPicks);
      })
    );
  }

  filterUserPicks(allUserSelections: IUserGolfPicks[]): IUserGolfPicks {
    let userPicks: IUserGolfPicks = {
      golfer1: INITIALIZED_VALUE,
      golfer2: INITIALIZED_VALUE,
      golfer3: INITIALIZED_VALUE,
      golfer4: INITIALIZED_VALUE,
      golfer5: INITIALIZED_VALUE,
      golfer6: INITIALIZED_VALUE,
      golfer7: INITIALIZED_VALUE,
      golfer8: INITIALIZED_VALUE,
      team: INITIALIZED_VALUE,
      eventId: INITIALIZED_VALUE,
      email: INITIALIZED_VALUE
    };

    const userRecord = allUserSelections.find(
      (picks) =>
        picks.eventId === this.sportsApi.getActiveEventId() &&
        picks.email === this.authService.getCurrentUser()
    );

    if (userRecord) {
      userPicks = { ...userRecord };
    }

    return userPicks;
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
