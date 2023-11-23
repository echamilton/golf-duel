import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IScoreCard } from '../../models/models';
import { ScoreValueColors } from './../../models/constants';
import { GolfStoreFacade } from 'src/app/store/golf.store.facade';

@Component({
  selector: 'golf-scorecard-pop',
  templateUrl: './scorecard-pop.component.html',
  styleUrls: ['./scorecard-pop.component.scss']
})
export class ScorecardPopComponent {
  scorecard$: Observable<IScoreCard>;
  isScorecardLoading$: Observable<boolean>;

  constructor(private golfFacade: GolfStoreFacade) {
    this.scorecard$ = this.golfFacade.getGolferScorecard();
    this.isScorecardLoading$ = this.golfFacade.isScorecardLoading();
  }

  getColor(score: string) {
    const scoreColor = ScoreValueColors.find(
      (scoreRecord) => scoreRecord.score === score
    );
    return scoreColor ? scoreColor.color : 'purple';
  }
}
