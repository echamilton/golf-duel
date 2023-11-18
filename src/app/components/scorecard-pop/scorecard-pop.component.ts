import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IScoreCardModal, IScoreCard } from '../../models/models';
import { ScoreValueColors } from './../../models/constants';
import { GolfStoreFacade } from 'src/app/store/golf.store.facade';

@Component({
  selector: 'golf-scorecard-pop',
  templateUrl: './scorecard-pop.component.html',
  styleUrls: ['./scorecard-pop.component.scss']
})
export class ScorecardPopComponent {
  scorecard$: Observable<IScoreCard>;

  constructor(
    private golfFacade: GolfStoreFacade,
    @Inject(MAT_DIALOG_DATA) data: IScoreCardModal
  ) {
    this.scorecard$ = this.golfFacade.getGolferScorecard();
  }

  getColor(score: string) {
    const scoreColor = ScoreValueColors.find(
      (scoreRecord) => scoreRecord.score === score
    );
    return scoreColor ? scoreColor.color : 'purple';
  }
}
