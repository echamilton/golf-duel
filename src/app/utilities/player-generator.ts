import { IPlayer } from '../models/models';
import { golfersFile } from './players';
import * as cloneDeep from 'lodash';

export function buildPlayerList(golfersFromEspn: IPlayer[]): void {
  const file = cloneDeep(golfersFile);
  file.forEach((file) => {
    const golfer = golfersFromEspn.find((x) => x.name == file.name);
    if (golfer) {
      file.golferId = Number(golfer.golferId);
    }
  });
  console.log(file);
}
