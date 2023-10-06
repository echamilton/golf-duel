import { buildPlayerList } from './player-generator';
import { golfersFile } from './players';
import { GOLFER_ACTIVE } from './test-data';

describe('player-generator', () => {
  it('should log out the players object', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const playerFromEspn = GOLFER_ACTIVE;
    const playersFromEspn = [];
    playersFromEspn.push(playerFromEspn);
    const playersFile = golfersFile;
    const playerRecord = playersFile.find(
      (player) => (player.name = 'Tiger Woods')
    );
    playerRecord!.golferId = '1234';

    buildPlayerList(playersFromEspn);

    expect(consoleSpy).toHaveBeenCalledWith(playersFile);
  });
});
