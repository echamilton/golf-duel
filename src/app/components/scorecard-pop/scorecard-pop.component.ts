import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SportsApiService } from '../../services/sports-api.service';
import { IScoreCard } from '../../models/models';
import { ScoreValueColors } from './../../models/constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scorecard-pop',
  templateUrl: './scorecard-pop.component.html',
  styleUrls: ['./scorecard-pop.component.scss']
})
export class ScorecardPopComponent implements OnInit {
  scorecard$: Observable<IScoreCard>;
  imageLink: string;

  constructor(
    private sportsApi: SportsApiService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.scorecard$ = this.sportsApi.getGolferScoreCard(
      data.golferId,
      Number(data.round)
    );
    this.imageLink = data.img;
  }

  ngOnInit() {}

  getColor(score) {
    const scoreColor = ScoreValueColors.find(
      (scoreRecord) => scoreRecord.score === score
    );
    return scoreColor ? scoreColor.color : 'purple';
  }
}
