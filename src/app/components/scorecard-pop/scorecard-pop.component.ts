import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SportsApiService } from '../../services/sports-api.service';
import { IScoreCardModal, IScoreCard } from '../../models/models';
import { ScoreValueColors } from './../../models/constants';

@Component({
  selector: 'golf-scorecard-pop',
  templateUrl: './scorecard-pop.component.html',
  styleUrls: ['./scorecard-pop.component.scss']
})
export class ScorecardPopComponent {
  scorecard$: Observable<IScoreCard>;
  imageLink: string;

  constructor(
    private sportsApi: SportsApiService,
    @Inject(MAT_DIALOG_DATA) data: IScoreCardModal
  ) {
    this.scorecard$ = this.sportsApi.getGolferScoreCard(
      data.golferId,
      Number(data.round)
    );
    this.imageLink = data.img;
  }

  getColor(score: string) {
    const scoreColor = ScoreValueColors.find(
      (scoreRecord) => scoreRecord.score === score
    );
    return scoreColor ? scoreColor.color : 'purple';
  }
}
