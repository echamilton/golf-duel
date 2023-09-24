import { IPlayer } from '../models/models';
import { golfersFile } from './players';

export function buildPlayerList(golfersFromEspn: IPlayer[]): void {
  golfersFile.forEach((file) => {
    const golfer = golfersFromEspn.find((x) => x.name == file.name);
    if (golfer) {
      file.golferId = Number(golfer.golferId);
    }
  });
  console.log(golfersFile);
}
