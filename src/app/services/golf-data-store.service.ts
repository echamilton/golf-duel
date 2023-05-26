import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  getDatabase,
  ref,
  Database,
  get,
  remove,
  update
} from 'firebase/database';
import { IUserGolfPicks, IGolferGrouping } from '../models/models';
import {
  INITIALIZED_VALUE,
  INITIALIZED_GOLFER,
  TournamentConfig
} from '../models/constants';
import { SportsApiService } from './sports-api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GolfDataStoreService {
  private fireData: Database;
  constructor(
    private sportsApi: SportsApiService,
    private authService: AuthService
  ) {
    this.fireData = getDatabase();
  }

  getGolferGroupings(): Observable<IGolferGrouping[]> {
    return from(this.getGolferGroupingsDb()).pipe(
      map((groupings: any) => {
        const tournamentGroups: IGolferGrouping[] = groupings[0];
        return tournamentGroups;
      })
    );
  }

  async getGolferPicksDb(): Promise<IUserGolfPicks[]> {
    const dataSnapshot = await get(ref(this.fireData, 'myGolfers'));
    const entries: IUserGolfPicks[] = [];

    dataSnapshot.forEach((childSnapshot) => {
      entries.push(childSnapshot.val());
    });

    return entries;
  }

  async getGolferGroupingsDb(): Promise<any> {
    const entityName = TournamentConfig.find((data) => data.active)!.groupName;
    const groupsSnapshot = await get(ref(this.fireData, entityName));
    return groupsSnapshot.val();
  }

  getGolferPicks(): Observable<IUserGolfPicks[]> {
    return from(this.getGolferPicksDb()).pipe(
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
      golfer1: INITIALIZED_GOLFER,
      golfer2: INITIALIZED_GOLFER,
      golfer3: INITIALIZED_GOLFER,
      golfer4: INITIALIZED_GOLFER,
      golfer5: INITIALIZED_GOLFER,
      golfer6: INITIALIZED_GOLFER,
      golfer7: INITIALIZED_GOLFER,
      golfer8: INITIALIZED_GOLFER,
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
    const entryReferenceKey =
      'myGolfers/' + this.sportsApi.getActiveEventId() + '-' + userPicks.team;
    const dataToUpdate: any = {};

    dataToUpdate[entryReferenceKey as keyof IUserGolfPicks] = userPicks;
    update(ref(this.fireData), dataToUpdate);
    return of(true);
  }

  deleteGolferPicks(userPicks: IUserGolfPicks): Observable<boolean> {
    const entryReferenceKey =
      'myGolfers/' + this.sportsApi.getActiveEventId() + '-' + userPicks.team;
    remove(ref(this.fireData, entryReferenceKey)).then((_) => {});
    return of(true);
  }
}
