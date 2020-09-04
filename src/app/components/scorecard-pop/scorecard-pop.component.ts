import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SportsApiService } from '../../services/sports-api';
import { IScoreCard, IPlayer } from '../../models/models';
import { ScoreValues } from './../../models/constants';

@Component({
  selector: 'app-scorecard-pop',
  templateUrl: './scorecard-pop.component.html',
  styleUrls: ['./scorecard-pop.component.scss']
})
export class ScorecardPopComponent implements OnInit {
  golfer: IPlayer;
  loading: boolean;
  scoreCard: IScoreCard = {};

  constructor(
    private sportsApi: SportsApiService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.golfer = data.golfer;
    this.scoreCard.In = {};
    this.scoreCard.Out = {};
    this.scoreCard.Total = {};
    this.sportsApi
      .getGolferScoreCard(this.golfer.golferId, Number(this.golfer.round))
      .subscribe((scorecard) => {
        console.log('here');
      });
  }

  ngOnInit() {
    this.loading = true;
  }

  buildScorecard(playerData) {
    let frontNine: any;
    let backNine: any;
    let i = 0;
    let currentHole = 0;
    let parIn = 0;
    let parOut = 0;
    let holeIn = 0;
    let holeOut = 0;

    // let holePars = frontNine.lines.find((type) => type.lineType === 'par');
    // for (const scores of holeScores.holes) {
    //   i++;
    //   currentHole++;
    //   this.scoreCard['hole' + currentHole] = {};
    //   this.scoreCard['hole' + currentHole].score = scores.score;
    //   this.scoreCard['hole' + currentHole].par = holePars.holes[i - 1];
    //   this.scoreCard['hole' + currentHole].indicator = this.calculateHole(
    //     scores.score,
    //     holePars.holes[i - 1]
    //   );
    //   parOut = +parOut + +holePars.holes[i - 1];
    //   if (scores.score.toString() !== '--') {
    //     holeOut = holeOut + +scores.score;
    //   }
    // }

    // holeScores = backNine.lines.find((type) => type.lineType === 'playerData');
    // holePars = backNine.lines.find((type) => type.lineType === 'par');
    // i = 0;
    // for (const scores of holeScores.holes) {
    //   i++;
    //   currentHole++;
    //   this.scoreCard['hole' + currentHole] = {};
    //   this.scoreCard['hole' + currentHole].score = scores.score;
    //   this.scoreCard['hole' + currentHole].par = holePars.holes[i - 1];
    //   this.scoreCard['hole' + currentHole].indicator = this.calculateHole(
    //     scores.score,
    //     holePars.holes[i - 1]
    //   );
    //   parIn = parIn + +holePars.holes[i - 1];
    //   if (scores.score.toString() !== '--') {
    //     holeIn = holeIn + +scores.score;
    //   }
    // }

    this.scoreCard.In.par = parIn.toString();
    this.scoreCard.Out.par = parOut.toString();
    this.scoreCard.Out.score = holeOut.toString();
    this.scoreCard.In.score = holeIn.toString();
    this.scoreCard.Total.par = (parIn + parOut).toString();
    this.scoreCard.Total.score = (holeIn + holeOut).toString();
    this.loading = false;
  }

  getColor(score) {
    let color: string;
    switch (score) {
      case ScoreValues.par: {
        color = 'black';
        break;
      }
      case ScoreValues.birdie: {
        color = 'blue';
        break;
      }
      case ScoreValues.bogey: {
        color = 'red';
        break;
      }
      case ScoreValues.eagle: {
        color = 'green';
        break;
      }
      case ScoreValues.double: {
        color = 'purple';
        break;
      }
      case ScoreValues.noScore: {
        color = 'black';
        break;
      }
      default: {
        color = 'purple';
        break;
      }
    }
    return color;
  }
}
