import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserGolfPicks, IGolferGrouping } from '../models/models';
import { INITIALIZED_VALUE, TournamentConfig } from '../models/constants';
import { SportsApiService } from './sports-api.service';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class GolfDataStoreService {
  constructor(
    private fireDb: AngularFireDatabase,
    private sportsApi: SportsApiService,
    private authService: AuthService
  ) {}

  getGolferGroupings(): Observable<IGolferGrouping[]> {
    return this.getGolferGroupingsDb().pipe(
      map((groupings: any) => {
        const tournamentGroups: IGolferGrouping[] = groupings[0];
        return tournamentGroups;
      })
    );
  }

  getGolferPicksDb(): any {
    return this.fireDb.list('myGolfers').valueChanges();
  }

  getGolferGroupingsDb(): any {
    const entityName = TournamentConfig.find((data) => data.active)!.groupName;
    return this.fireDb.list<IGolferGrouping>(entityName).valueChanges();
  }

  getGolferPicks(): Observable<IUserGolfPicks[]> {
    return this.getGolferPicksDb().pipe(
      map((contestants: any) => {
        const filteredContestants = contestants.filter(
          (record: any) => record.eventId === this.sportsApi.getActiveEventId()
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

  updateGolferPicks(userPicks: IUserGolfPicks): Observable<boolean> {
    this.fireDb
      .object(
        'myGolfers/' + this.sportsApi.getActiveEventId() + '-' + userPicks.team
      )
      .update(userPicks)
      .then((_) => {});

    return of(true);
  }

  deleteGolferPicks(userPicks: IUserGolfPicks): Observable<boolean> {
    this.fireDb
      .list('myGolfers')
      .remove(this.sportsApi.getActiveEventId() + '-' + userPicks.team)
      .then((_) => {});
    return of(true);
  }
}
