import { Action } from '@ngrx/store';
import { ITournamentResults } from './../models/models';

export enum GolfActionTypes {
  GetTournamentDataLoad = '[Golf] Get Tournament Load',
  GetTournamentDataSuccess = '[Golf] Get Tournament Success'
}

export class GetTournamentLoad implements Action {
  public readonly type = GolfActionTypes.GetTournamentDataLoad;
}

export class GetTournamentSuccess implements Action {
  public readonly type = GolfActionTypes.GetTournamentDataSuccess;

  constructor(public payload: ITournamentResults) {}
}

export type GolfActions = GetTournamentLoad | GetTournamentSuccess;
