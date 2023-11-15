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
import {
  IUserGolfPicks,
  IGolferGrouping,
  IEntriesGolferDataStore
} from '../models/models';
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

  getGolferPicks(): Observable<IEntriesGolferDataStore> {
    return from(this.getGolferPicksDb());
  }

  getGolferGroupings(): Observable<IGolferGrouping[]> {
    return from(this.getGolferGroupingsDb()).pipe(
      map((groupings: any) => {
        const tournamentGroups: IGolferGrouping[] = groupings
          ? groupings[0]
          : [];
        return tournamentGroups;
      })
    );
  }

  async getGolferPicksDb(): Promise<IEntriesGolferDataStore> {
    const dataSnapshot = await get(
      ref(this.fireData, 'tournaments/' + TournamentConfig.eventId)
    );

    const userPicks: IUserGolfPicks = {
      golfer1: INITIALIZED_GOLFER,
      golfer2: INITIALIZED_GOLFER,
      golfer3: INITIALIZED_GOLFER,
      golfer4: INITIALIZED_GOLFER,
      golfer5: INITIALIZED_GOLFER,
      golfer6: INITIALIZED_GOLFER,
      golfer7: INITIALIZED_GOLFER,
      golfer8: INITIALIZED_GOLFER,
      team: INITIALIZED_VALUE
    };
    const entryData: IEntriesGolferDataStore = {
      allEntries: [],
      userEntry: userPicks
    };

    if (dataSnapshot.val())
      entryData.userEntry =
        dataSnapshot.val()[this.authService.getCurrentUser()];

    dataSnapshot.forEach((childSnapshot) => {
      entryData.allEntries.push(childSnapshot.val());
    });

    return entryData;
  }

  async getGolferGroupingsDb(): Promise<any> {
    const entityName = TournamentConfig.groupName;
    const groupsSnapshot = await get(ref(this.fireData, entityName));
    return groupsSnapshot.val();
  }

  updateGolferPicks(userPicks: IUserGolfPicks): Observable<boolean> {
    const dataToUpdate: any = {};
    dataToUpdate[
      'tournaments/' +
        TournamentConfig.eventId +
        '/' +
        this.authService.getCurrentUser()
    ] = userPicks;

    update(ref(this.fireData), dataToUpdate);
    return of(true);
  }

  deleteGolferPicks(userPicks: IUserGolfPicks): Observable<boolean> {
    const entryReferenceKey =
      'myGolfers/' + TournamentConfig.eventId + '-' + userPicks.team;
    remove(ref(this.fireData, entryReferenceKey)).then((_) => {});
    return of(true);
  }
}
