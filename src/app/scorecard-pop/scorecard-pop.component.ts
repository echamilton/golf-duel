import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SportsApiService } from '../services/sports-api';
import { IScoreCard } from '../models';
import { ScoreValues } from '../constants';

@Component({
  selector: 'app-scorecard-pop',
  templateUrl: './scorecard-pop.component.html',
  styleUrls: ['./scorecard-pop.component.scss']
})
export class ScorecardPopComponent implements OnInit {
  pgaTournyRespPlayers: any[];
  golferId: string;
  loading: boolean;
  currentRound: string;
  playerName: string;
  scoreCard: IScoreCard = {};

  constructor(private sportsApi: SportsApiService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.golferId = data.golfer;
    this.currentRound = data.roundId;
    this.playerName = data.name;
    this.scoreCard.In = {};
    this.scoreCard.Out = {};
    this.scoreCard.Total = {};
  }

  ngOnInit() {
    this.loading = true;
    // this.sportsApi.getPlayerScoreCard(this.golferId, this.currentRound).
    //   subscribe(scoreCard => {
    //     this.buildScorecard(scoreCard);
    //   }
    //   );
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

    frontNine = playerData.scoreCards.pages[0];
    backNine = playerData.scoreCards.pages[1];

    let holeScores = frontNine.lines.find(type => type.lineType === 'playerData');
    let holePars = frontNine.lines.find(type => type.lineType === 'par');
    for (const scores of holeScores.holes) {
      i++;
      currentHole++;
      this.scoreCard['hole' + currentHole] = {};
      this.scoreCard['hole' + currentHole].score = scores.score;
      this.scoreCard['hole' + currentHole].par = holePars.holes[i - 1];
      this.scoreCard['hole' + currentHole].indicator = this.calculateHole(scores.score, holePars.holes[i - 1]);
      parOut = +parOut + +holePars.holes[i - 1];
      if (scores.score.toString() !== '--') {
        holeOut = holeOut + +scores.score;
      }
    }

    holeScores = backNine.lines.find(type => type.lineType === 'playerData');
    holePars = backNine.lines.find(type => type.lineType === 'par');
    i = 0;
    for (const scores of holeScores.holes) {
      i++;
      currentHole++;
      this.scoreCard['hole' + currentHole] = {};
      this.scoreCard['hole' + currentHole].score = scores.score;
      this.scoreCard['hole' + currentHole].par = holePars.holes[i - 1];
      this.scoreCard['hole' + currentHole].indicator = this.calculateHole(scores.score, holePars.holes[i - 1]);
      parIn = parIn + +holePars.holes[i - 1];
      if (scores.score.toString() !== '--') {
        holeIn = holeIn + +scores.score;
      }
    }

    this.scoreCard.playerName = this.playerName;
    this.scoreCard.In.par = parIn.toString();
    this.scoreCard.Out.par = parOut.toString();
    this.scoreCard.Out.score = holeOut.toString();
    this.scoreCard.In.score = holeIn.toString();
    this.scoreCard.Total.par = (parIn + parOut).toString();
    this.scoreCard.Total.score = (holeIn + holeOut).toString();
    this.loading = false;
  }

  calculateHole(score: number, par: number) {
    let diff: number;
    const scoreStr = score.toString();

    diff = score - par;
    if (score && scoreStr !== '--') {
      if (diff === 0) {
        return ScoreValues.par;
      } else if (diff === -1) {
        return ScoreValues.birdie;
      } else if (diff === -2) {
        return ScoreValues.eagle;
      } else if (diff === 1) {
        return ScoreValues.bogey;
      } else if (diff === 2) {
        return ScoreValues.double;
      } else if (diff === 3) {
        return ScoreValues.triple;
      } else {
        return ScoreValues.triple;
      }
    } else {
      return ScoreValues.noScore;
    }
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
