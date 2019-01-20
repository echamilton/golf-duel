import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SportsApiService } from '../sports-api';
import { ScoreCard } from '../models';

@Component({
  selector: 'app-scorecard-pop',
  templateUrl: './scorecard-pop.component.html',
  styleUrls: ['./scorecard-pop.component.scss']
})
export class ScorecardPopComponent implements OnInit {
  pgaTournyRespPlayers: any[];
  golferId: string;
  scoreCard: ScoreCard;

  constructor(private sportsApi: SportsApiService,
    @Inject(MAT_DIALOG_DATA) data) {

    this.golferId = data.golfer;
    this.initScoreCard();
  }

  ngOnInit() {
    let pgaPlayer = {} as any;
    this.pgaTournyRespPlayers = this.sportsApi.getApiData().leaderboard.players;
    pgaPlayer = this.pgaTournyRespPlayers.find(player => player.player_id == this.golferId);
   
    this.buildScorecard(pgaPlayer);
  }

  buildScorecard(playerData) {
    let holes: any[];
    let i = 0;
    let parIn = 0;
    let parOut = 0;
    let holeIn = 0;
    let holeOut = 0;
    holes = playerData.holes;

    for (let hole of holes) {
      i++;
      this.scoreCard['hole' + i].score = hole.strokes;
      this.scoreCard['hole' + i].par = hole.par;

      this.scoreCard['hole' + i].indicator = this.calculateHole(hole.strokes, hole.par);

      if (i < 10) {
        parOut = +parOut + +hole.par;
        holeOut = holeOut + +hole.strokes;
      } else {
        parIn = parIn + +hole.par;
        holeIn = holeIn + +hole.strokes;
      }
    }
    this.scoreCard.playerName = playerData.player_bio.first_name + ' ' + playerData.player_bio.last_name;
    this.scoreCard.In.par = parIn.toString();
    this.scoreCard.Out.par = parOut.toString();
    this.scoreCard.Out.score = holeOut.toString();
    this.scoreCard.In.score = holeIn.toString();
    this.scoreCard.Total.par = (parIn + parOut).toString();
    this.scoreCard.Total.score = (holeIn + holeOut).toString();
  }

  calculateHole(score: number, par: number) {
    let diff: number;

    if (score == null) {
      return '';
    }

    diff = score - par;

    if (diff == 0) {
      return 'PAR';
    }
    else if (diff == -1) {
      return 'BIRDIE';
    }
    else if (diff == -2) {
      return 'EAGLE';
    }
    else if (diff == 1) {
      return 'BOGEY';
    }
    else if (diff == 2) {
      return 'DOUBLE';
    }
    else {
      return 'DOUBLE';
    }
  }

  initScoreCard() {
    this.scoreCard = {
      playerName: '',
      hole1: { score: '', par: '', indicator: '' },
      hole2: { score: '', par: '', indicator: '' },
      hole3: { score: '', par: '', indicator: '' },
      hole4: { score: '', par: '', indicator: '' },
      hole5: { score: '', par: '', indicator: '' },
      hole6: { score: '', par: '', indicator: '' },
      hole7: { score: '', par: '', indicator: '' },
      hole8: { score: '', par: '', indicator: '' },
      hole9: { score: '', par: '', indicator: '' },
      hole10: { score: '', par: '', indicator: '' },
      hole11: { score: '', par: '', indicator: '' },
      hole12: { score: '', par: '', indicator: '' },
      hole13: { score: '', par: '', indicator: '' },
      hole14: { score: '', par: '', indicator: '' },
      hole15: { score: '', par: '', indicator: '' },
      hole16: { score: '', par: '', indicator: '' },
      hole17: { score: '', par: '', indicator: '' },
      hole18: { score: '', par: '', indicator: '' },
      In: { score: '', par: '', indicator: '' },
      Out: { score: '', par: '', indicator: '' },
      Total: { score: '', par: '', indicator: '' },
    };
  }

}
