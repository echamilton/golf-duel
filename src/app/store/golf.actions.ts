import { Action } from '@ngrx/store';
import { ITournamentResults, IGolferGroupingsUI } from './../models/models';

export enum GolfActionTypes {
  GetTournamentDataLoad = '[Golf] Get Tournament Load',
  GetTournamentDataSuccess = '[Golf] Get Tournament Success',
  GetGolferGroupings = '[Golf] Get golfer groupings',
  GetGolferGroupingsComp = '[Golf] Golfer groupings loaded'
}

export class GetTournamentLoad implements Action {
  public readonly type = GolfActionTypes.GetTournamentDataLoad;
}

export class GetTournamentSuccess implements Action {
  public readonly type = GolfActionTypes.GetTournamentDataSuccess;

  constructor(public payload: ITournamentResults) {}
}

export class GetGolferGroupings implements Action {
  public readonly type = GolfActionTypes.GetGolferGroupings;

  constructor() {}
}

export class GetGolferGroupingsComplete implements Action {
  public readonly type = GolfActionTypes.GetGolferGroupingsComp;

  constructor(public payload: IGolferGroupingsUI) {}
}

export type GolfActions =
  | GetTournamentLoad
  | GetTournamentSuccess
  | GetGolferGroupingsComplete
  | GetGolferGroupings;
